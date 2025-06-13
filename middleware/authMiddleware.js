module.exports = (req, res, next) => {
    //console.log('🔐 Auth middleware is running');
    if (!req.session.userId) {
      //console.log('❌ Not logged in - responding with 401');
      const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
      const isAjax = req.xhr || acceptsJson;
  
      if (isAjax) {
        return res.status(401).json({ 
          error: 'You must be logged in to follow topics.', 
          loginUrl: '/auth/login' 
        });
      }
  
      // Optional fallback if not AJAX
      return res.redirect('/auth/login');
    }
  
    console.log('✅ User is authenticated');
    next();
  };
  