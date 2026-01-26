const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");

const ratingAndReviewSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    rating : {
        type : Number
    },
    review : {
        type: String
    }
});

const ratingAndReviewModel = model("RatingAndReview", ratingAndReviewSchema);

module.exports = ratingAndReviewModel