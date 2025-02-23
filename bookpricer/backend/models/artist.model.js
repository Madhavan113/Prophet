import mongoose from 'mongoose';


const ArtistCoinSchema = new mongoose.Schema({
  artistId: { type: String, required: true, unique: true },
  currentPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  priceChange: { type: mongoose.Schema.Types.Decimal128, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Create a model from the schema
const ArtistCoinModel = mongoose.model('ArtistCoin', ArtistCoinSchema);

// Export the model
export default ArtistCoinModel;