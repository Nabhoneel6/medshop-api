import Cart from "../models/Cart.js";
import Medicine from "../models/Medicine.js";

// Helper: get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.medicine");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity = 1 } = req.body;

    if (!medicineId) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingIndex = cart.items.findIndex(
      (item) => item.medicine._id.toString() === medicineId,
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        medicine: medicine._id,
        quantity: Number(quantity),
        price: medicine.price,
      });
    }

    cart.recalculate();
    await cart.save();
    await cart.populate("items.medicine");

    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;

    if (!medicineId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "medicineId and quantity are required" });
    }

    const cart = await getOrCreateCart(req.user._id);

    const item = cart.items.find(
      (i) => i.medicine._id.toString() === medicineId,
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.medicine._id.toString() !== medicineId,
      );
    } else {
      item.quantity = Number(quantity);
    }

    cart.recalculate();
    await cart.save();
    await cart.populate("items.medicine");

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:medicineId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter(
      (i) => i.medicine._id.toString() !== medicineId,
    );

    cart.recalculate();
    await cart.save();
    await cart.populate("items.medicine");

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.recalculate();
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
