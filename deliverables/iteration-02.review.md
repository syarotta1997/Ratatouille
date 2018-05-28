# Ratatouille / team 23

## Iteration 02 - Review & Retrospect

 * When: March 8th, 2018
 * Where: GB303

## Process - Reflection


#### Decisions that turned out well

 1. We each shared our own ideas about the UI designs and then came to a conclusion about what design we were going to implement, as opposed to working on each page separately. This was successful because it reduced a lot of time for us when we had did a refurbishing of the app in order to have a more unified style of the UI.
  
 2. We decide what tasks should be fulfilled and then distributed them across members. This turned out to be successful because after the initially meeting, we decided to implement views and functions for pages including log in / registration page, dashboard profile for service provider accounts, past order history for client accounts, service search page, message page and account setting page. We then decides to assign each of the above tasks as follows: Log in/ Registration (Helen/Ke Lan), Search Page (Vlad), Profile for clients (Mariko), Profile for service provider(Akanksha), Message page (Emil) and account setting page (Mike/Yu Xuan).
 
 3. On certain occasions, we grouped up in smaller groups, 2-3 people and coded on core functionalities that behaved in a similar manner. Having this face to face contanct meant agreeing on smaller implementations and sharing re-usable code from the project went by more smoothly. Log In and Registration, was one interconnected set, the other was the two different profile screens which depended on which type of account a user signed in as.
 
 ![Imgur](https://i.imgur.com/JjZu58y.png)
 ![Imgur](https://i.imgur.com/Qye8lwo.jpg)
 ![Imgur](https://i.imgur.com/kJnnRck.jpg)

#### Decisions that did not turn out as well as we hoped

The only problem with assigning each member a completely different task was that each member was in charge of their own deadlines and unfortunately not every task was met for the deliverable. As a future reference, We should have assigned deadlines as a team at the beginning of the next deliverable.

We planned to meet in person but due to schedule/ location conflicts this did not happen as often as we would have liked. We were only able to conduct full group meetings over skype and in tutorial. We did not have group coding sessions. Subdivisions of the group met up in person to review code/ go over minor coding details. Bigger idea/ layout issues were delt with in tutorial or over skype when the entirety of the group was present. 

#### Planned changes

We must have a meeting at the beginning of the next deliverable period to sort out individual deadlines and assure that they will be met (every member must be present and agree on their assigned task). 

Have shorter regular update meetings rather than longer sparsed update meetings. Due to scheduling conflicts its harder to find time for longer periods, it would be more convenient if it was a 20 minute quick updates and discussion meeting instead. 

## Product - Review

#### Goals and/or tasks that were met/completed:
 
  Our task is basically divided into doing several different pages for our application, each page (except for messages) is fully implemented with the core features.
 1. Registration page
 2. Login Page
 3. Account pages (uploading profile picture, editing email, etc)
 4. Search page (by name and/or provided service such as chef or barista)
 5. Profile pages for clients (with past orders and order details) and chefs (with pictures and discriptions)

#### Goals and/or tasks that were planned but not met/completed:

   Messages was not completed and therefore clients and chefs cannot connect with each other yet. This was due to time constraints and difficulties using and learning React Native. 

   For client and service provider, we had to change from uploading an image from device to uploading an image via URL. This was due to space issues related to our databse. 
   
   For the client profile, we had first decided to allow the client to upload photos to their orders. But we then agreed that we wanted the creative side of the app to be strictly for the chefs/bartenders (so they can add pictures for each order in order to have complete control over their portfolio) whereas clients are simply customers that can view their past orders and make new orders. 
   
   For service provider profile, we prioritized linking the profile with searches and implementing upload of pictures and linking it to database. However a certain functionality of deleting the picture has not been implemented yet due to time constraints. However it is possible to edit the description that goes with the picture.

## Meeting Highlights

Going into the next iteration, our main insights are:

 We have come to some conclusion on the particular style of the app, having a blue and purple color implementation, with a white background for spaces in the layout, yet greater defining the style would not hurt. As an example, in particular, the different libraries we use for text fields and input, which come with different predefined styles and margin numbers on the sides.
 
 We currently have small differences between our android and ios mobile versions, such as there is a difference in the header margin. Further testing for any unforeseen differences wouldn't hurt. In particular, the biggest difference is the lack of a back button on an ios mobile device, which as of now we have successfully dealt with on by having a back button on the registration page and the portfolio page.

 For the client aspect (on the portfolio/past orders tab) of the app, we should implement a way for them to add ratings/ comment. This should make finding their favorite chefs easier as well as giving chefs feedback. Their feedback/ rating would be made known to the chef. We should decide whether we want ratings/comments to be public to other client users. 

 We need a way for chefs to confirm that the order occurred after the fact in order to have records of the order in the passed order's (portfolio) tab. Basically, the chef would accept or send a signal to the app which would then charge the client and the order would be recorded. 

 In the portfolio, when clients look at their past orders, it would be useful to link the chef's name to their portfolio. This would make it simpler for the user to connect to the chef rather than find out the name and then search it in the search tab.
 
 Move away from Expo so that we can have access to a larger database and then be able to upload images from the device rather than input a URL. 

 We need to implement messages between clients and chefs (this is how services will be initated).

 We need to focus on assigning personal deadlines and meeting those deadlines. 
