// This middleware checks if a user is logged in.
const isUserLoggedIn = (req, res, next) => {
    if (req.session && req.session.iduser) {
        // User is logged in, proceed to the next middleware or route handler
        next();
    } else {
        // User is not logged in, redirect to login page
        // Add cache-control headers to prevent browser caching of the unauthenticated page
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        return res.redirect('/login'); // Redirect to your login page
    }
};

// This middleware checks if the logged-in user is blocked.
// It should only be used *after* isUserLoggedIn middleware.
const isUserBlocked = async (req, res, next) => {
    try {
        if (req.session && req.session.iduser) { // Ensure user is actually logged in before checking block status
            const loggedInUser = await user.findById(req.session.iduser); // Assuming iduser stores the user's _id
            if (loggedInUser && loggedInUser.isBlocked) {
                // If user is blocked, destroy session and redirect to a specific page
                req.session.destroy(err => {
                    if (err) {
                        console.error('Session destroy error for blocked user:', err);
                    }
                    res.clearCookie('token'); // Clear token if used
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.header('Expires', '-1');
                    res.header('Pragma', 'no-cache');
                    return res.redirect('/login?message=You have been blocked.'); // Redirect with a message
                });
            } else if (!loggedInUser) { // User ID in session but not found in DB (e.g., deleted user)
                 req.session.destroy(err => {
                    if (err) console.error('Session destroy error for invalid user:', err);
                    res.clearCookie('token');
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.header('Expires', '-1');
                    res.header('Pragma', 'no-cache');
                    return res.redirect('/login?message=Invalid user session.');
                });
            } else {
                next(); // User is logged in and not blocked
            }
        } else {
            // This case should ideally be handled by isUserLoggedIn before this middleware
            // But as a fallback, if somehow reached without being logged in, redirect.
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isUserBlocked middleware:', error);
        // Handle database or other errors gracefully
        res.status(500).send('Server Error');
    }
};


module.exports = {
    isUserLoggedIn,
    isUserBlocked
};