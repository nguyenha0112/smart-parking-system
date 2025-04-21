import mongoose from 'mongoose';

const FavoriteParkingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan', required: true }, 
  parkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true }, 
});

export const FavoriteParking = mongoose.model('FavoriteParking', FavoriteParkingSchema);
