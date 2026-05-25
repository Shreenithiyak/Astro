import Project from "../model/projectModel.js";
import Service from "../model/serviceModel.js";
import Testimonial from "../model/testimonialModel.js";
import Contact from "../model/contactModel.js";
import Stat from "../model/statModel.js";

const crud = (Model, label) => ({
  getAll: async (req, res) => {
    try {
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.category && req.query.category !== "all")
        filter.category = req.query.category;
      const items = await Model.find(filter).sort({ order: 1, createdAt: -1 });
      res.json({ items });
    } catch (error) {
      res.status(500).json({ msg: `Failed to fetch ${label}`, error: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ msg: `${label} not found` });
      res.json({ item });
    } catch (error) {
      res.status(500).json({ msg: `Failed to fetch ${label}`, error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ msg: `${label} created`, item });
    } catch (error) {
      res.status(400).json({ msg: `Failed to create ${label}`, error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ msg: `${label} not found` });
      res.json({ msg: `${label} updated`, item });
    } catch (error) {
      res.status(400).json({ msg: `Failed to update ${label}`, error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ msg: `${label} not found` });
      res.json({ msg: `${label} deleted` });
    } catch (error) {
      res.status(500).json({ msg: `Failed to delete ${label}`, error: error.message });
    }
  },
});

export const projectCtrl = crud(Project, "Project");
export const serviceCtrl = crud(Service, "Service");
export const testimonialCtrl = crud(Testimonial, "Testimonial");
export const statCtrl = crud(Stat, "Stat");

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, projectType, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ msg: "Name and email are required" });
    }
    const item = await Contact.create({ name, email, phone, projectType, message });
    res.status(201).json({ msg: "Message sent successfully", item });
  } catch (error) {
    res.status(400).json({ msg: "Failed to submit", error: error.message });
  }
};

export const contactCtrl = {
  ...crud(Contact, "Contact"),
  getAll: async (req, res) => {
    try {
      const items = await Contact.find().sort({ createdAt: -1 });
      res.json({ items });
    } catch (error) {
      res.status(500).json({ msg: "Failed to fetch contacts", error: error.message });
    }
  },
};
