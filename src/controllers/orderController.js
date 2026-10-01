import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Medicine from "../models/Medicine.js";

// @desc    Place new order (from cart)
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    // Validate address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res
        .status(400)
        .json({ message: "Complete shipping address required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.medicine",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock for all items
    for (const item of cart.items) {
      const med = await Medicine.findById(item.medicine._id);
      if (!med) {
        return res
          .status(404)
          .json({
            message: `Medicine ${item.medicine.name} no longer available`,
          });
      }
      if (med.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${med.name}. Available: ${med.stock}`,
        });
      }
    }

    // Build order items
    const orderItems = cart.items.map((item) => ({
      medicine: item.medicine._id,
      name: item.medicine.name,
      brand: item.medicine.brand,
      image: item.medicine.images?.[0] || "",
      price: item.price,
      quantity: item.quantity,
    }));

    const itemsPrice = cart.totalPrice;
    const deliveryFee = itemsPrice > 500 ? 0 : 40;
    const totalPrice = itemsPrice + deliveryFee;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      itemsPrice,
      deliveryFee,
      totalPrice,
      orderStatus: "placed",
    });

    // Reduce stock
    for (const item of cart.items) {
      await Medicine.findByIdAndUpdate(item.medicine._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.recalculate();
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("PlaceOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order detail
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only owner or admin can view
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order (user can cancel if not shipped)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const cancellableStatuses = ["placed", "confirmed", "packed"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res
        .status(400)
        .json({
          message: `Order cannot be cancelled. Status: ${order.orderStatus}`,
        });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { stock: item.quantity },
      });
    }

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============== ADMIN ONLY ==============

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "placed",
      "confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "paid";
    }

    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      order.cancelledAt = new Date();
      // Restore stock
      for (const item of order.items) {
        await Medicine.findByIdAndUpdate(item.medicine, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
