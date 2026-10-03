import Doctor from "../models/Doctor.js";

// @desc    Get all doctors (public)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;
    const filter = { isActive: true };
    if (specialty) filter.specialty = specialty;

    const doctors = await Doctor.find(filter).sort({ rating: -1 });
    res.status(200).json({ count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Admin
export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ message: "Doctor added", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Admin
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor updated", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor (soft delete)
// @route   DELETE /api/doctors/:id
// @access  Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
