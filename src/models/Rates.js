import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Rate = mongoose.models.Rate || mongoose.model('Rate', RateSchema);

export default Rate;
