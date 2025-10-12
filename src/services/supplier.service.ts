import Supplier from "../models/Supplier.model";

export const getAllSuppliers = () => Supplier.find();
export const getSupplierById = (id: string) => Supplier.findById(id);
export const createSupplier = (data: any) => Supplier.create(data);
export const updateSupplier = (id: string, data: any) =>
  Supplier.findByIdAndUpdate(id, data, { new: true });
export const deleteSupplier = (id: string) => Supplier.findByIdAndDelete(id);