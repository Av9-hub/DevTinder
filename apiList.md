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
-post user/request/send/:status/:userId     status-interested/ignored
-post user/request/review/:status/:requestId  status-accepted/rejected

##userRouter 
-get/user/requests/receieved   //Get all the pending requests with interested status
-get/user/connections   //Get all the connections with "accepted " status
-get/user/feed          //Get the profiles of other users on platform

