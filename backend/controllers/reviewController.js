const Review = require('../src/models/Review');

// @desc    Add a new review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { rating, comment, feature } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: 'Please provide both rating and comment' });
        }

        const review = new Review({
            user: req.user._id,
            rating,
            comment,
            feature: feature || 'General Website'
        });

        const createdReview = await review.save();
        
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: createdReview
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, message: 'Server error while submitting review' });
    }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name occupation')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching reviews' });
    }
};

module.exports = {
    addReview,
    getReviews
};
