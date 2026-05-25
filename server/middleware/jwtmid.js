import jwt from 'jsonwebtoken';

export const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "token invalid or missing" });
    }
    
    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECURE || 'mysecretkey';
    const verify = jwt.verify(token, JWT_SECRET);
    req.users = verify;
    next();
  } catch (error) {
    console.log('error', error);
    res.status(401).json({ msg: "your token crashed", error: error.message });  
  }
};
