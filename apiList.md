#DEVTINDER API List

##auth router
-post /login
-post /signUp
-post /logout

##profileRouter
-get /profile/view
-patch /profile/update
-patch /profile/password

##Connection request router
-post user/request/send/intrested/:userId
-post user/request/send/ignored/:userId
-post user/request/review/accepted/:requestId
-post user/request/review/rejected/:requestId

##userRouter 
-get/user/connections
-get/user/requests
-get/user/feed -Get the profiles of other users on platform

