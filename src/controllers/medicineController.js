import Medicine from "../models/Medicine.js";
import Category from "../models/Category.js";

// @desc    Get all medicines (with filters)
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
  try {
    const { search, category, sort, minPrice, maxPrice, requiresPrescription } =
      req.query;

    const filter = { isActive: true };

    // Search by name/brand
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category (accepts id or slug)
    if (category) {
      const cat = await Category.findOne({
        $or: [
          { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
          { slug: category },
        ],
      });
      if (cat) filter.category = cat._id;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Prescription filter
    if (requiresPrescription !== undefined) {
      filter.requiresPrescription = requiresPrescription === "true";
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === "price_asc") sortBy = { price: 1 };
    if (sort === "price_desc") sortBy = { price: -1 };
    if (sort === "name_asc") sortBy = { name: 1 };
    if (sort === "rating_desc") sortBy = { rating: -1 };

    const medicines = await Medicine.find(filter)
      .populate("category", "name slug")
      .sort(sortBy);

    res.status(200).json({ count: medicines.length, medicines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      "category",
      "name slug",
    );
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({ medicine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create medicine
// @route   POST /api/medicines
// @access  Admin
export const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ message: "Medicine created", medicine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Admin
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({ message: "Medicine updated", medicine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medicine (soft delete)
// @route   DELETE /api/medicines/:id
// @access  Admin
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({ message: "Medicine deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
