import Publisher from "../models/Publisher.model";

export const getAllPublishers = () => Publisher.find();
export const getPublisherById = (id: string) => Publisher.findById(id);
export const createPublisher = (data: any) => Publisher.create(data);
export const updatePublisher = (id: string, data: any) =>
  Publisher.findByIdAndUpdate(id, data, { new: true });
export const deletePublisher = (id: string) => Publisher.findByIdAndDelete(id);