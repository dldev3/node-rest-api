const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//sign up
router.post('/signup', (req,res,next) => {
			User.find({email: req.body.email})
				.exec()
				.then(user => {
					if(user.length >= 1){
						return res.status(409).json({
							message: 'Mail exists'
						});
					} else {
						bcrypt.hash(req.body.password, 10, (err, hash) => {
							if(err){
								return res.status(500).json({
									error: err
								});
							} else {
							const user = new User({
									_id: new mongoose.Types.ObjectId(),
									email: req.body.email,
									password: hash
								});
							user.save()
								.then(result => {
									console.log(result);
									res.status(201).json({
										message: 'User Created',
										user: {
											id: result._id,
											email: result.email,
											hashed_password: result.password
										}
									})
								})
								.catch( err => {
									console.log(err)
								});
						}
					})
				}
				}).catch(err => {
					res.status(500).json({
						message: 'User Creation faild',
						error: err
					})
				});

			
			
		})



//sign in
router.post('/signin', (req,res,next) => {
	User.find({email: req.body.email})
	.exec()
	.then(user => {
		if(user.length < 1){
			return res.status(401).json({
				message: 'Auth Failed'
			});
		} 
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if(err){
					return res.status(401).json({
						message: 'Auth Failed'
				});
			}
			if(result) {
				const token = jwt.sign({
					email: user[0].email,
					userId: user[0]._id
				}, process.env.JWT_SECRET_KEY, {
					expiresIn: "1h"
				});
				return res.status(200).json({
					message: 'Login Successful',
					token : token
				})
			}
			res.status(401).json({
				message: 'Auth Failed'
			});
		})
	})
	.catch(err => {
		res.status(500).json({
			message: 'Error Occured!',
			error: err
		})
	})
});




//get all users (admin)
router.get('/', (req, res, next) => {
    User.find()
        .select("email _id password")
        .exec()
        .then(results => {
            if (results.length > 0) {
                const response = {
                    count: results.length,
                    users: results.map(result => {
                        return {
                        	 _id: result._id,
                            email: result.email,
                            password: result.password
                        }
                    })
                };
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    message: 'No Users found'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


//delete users
router.delete('/:userId', (req,res,next) => {
	User.remove({ _id: req.params.userId })
	.exec()
	.then( result => {
		res.status(200).json({
			message: 'User Deleted'
		})
	})
	.catch(err => {
		res.status(500).json({
			message: 'User Deletion error',
			error: err
		})
	})
})



module.exports = router;