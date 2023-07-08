
# Updates
*12.02.2021 - Semi return to working on this project for this year. Updated how the paging for this web application works, and fixed some minor bugs. Well the holiday season is upon us, so I will return to my personal development vacation.*

*10.18.2021 - Many of the features I planned to implement have been finished. The remaining are just quality of life features. That in mind, I will be taking a break to focus on personal learning, and my own wellness. Work may resume next month, or early next year. -Nigel*

# JavaScript Ajax RestApi
This is a simple RestApi that runs on a Express server. The Front-End componet is a work in progress, and used strictly for testing the api in a more interactive way.
If you wish to see my Front-End design skills, please look at these examples:
<a href="https://clever-shirley-2f5664.netlify.app/">React Demo</a>
<a href="https://boring-hamilton-295e9a.netlify.app/">Angular Demo</a>
Also, this documentation is written with non technical people in mind, therefore it may be a bit more verbose than what programmers may expect.
<div>
      <img width="905" alt="express server api" src="https://user-images.githubusercontent.com/44081182/144500503-e938bbb9-d22c-4854-83c9-763344869e9c.png">
</div>
<a href="https://nseecharan-simple-rest-api.cyclic.app">https://nseecharan-simple-rest-api.cyclic.app</a>

# npm start
You run this command within the project folder, through the use of the command prompt terminal.
<p>For exemple: C:/user/desktop/[web app project folder]/ npm start</p>
<p>Doing so will allow you to view the web application at this link:</p> 
<a href="http://localhost:8080/">http://localhost:8080/</a>
<p>Using this command will also allow developers to see their code changes when they refresh the page in the browser.</p>

# Api Routes
<h3>/api/employees</h3>
<h3>/api/tasks</h3>
These are the main routes which will allow you to execute various CRUD (create, read, update, delete) procedures. They are secured with a "JSON Web Token," which is a secure piece of data to idetify you as a registered user, and grant the necessary access. As the project is still in early development, the route to create a new admin has not been implemented. However, this feature will be added once the API has an option to restore itself to a default setting. For now you may freely read the data fron the database, but you will not be able to, create, update, or delete any data until then. Demo routes are the exception to this rule, and will allow you to do all three, for one already provided employee, and task.

## Get
 <h3>/api/employees</h3>
 <h3>/api/tasks</h3>
  <p>When sent with a "Get," request, these routes will fetch all the task, and employee entries from their respective lists in the database</p>
  
## 

 <h3>/api/employees/find</h3>
 <h3>/api/tasks/find</h3> 
 <p>These routes are similar to the ones above, however these also require the entry's ID, and will attempt to return only one entry.</p>

 <p>A typical use case for this type of route, would be if you wanted to load the full data for a specific employee, or task, that you see in the list. The reason for this is that some databases have two versions of the same data. One light version for quick retrieval, and a dense one that contains the full data for each entry in a list. Trying to load that version, especially if it contains thousands of entries, would result in potential slowdowns when displaying the data. Therefore, it is better to load the light version for when you want quickly list all entries, and then only at the users request, use the entry's data in the lighter list, to look up it's full information in the heavier one.</p>
 
## Post

 <p>/api/employees/register</p>
 <p>/api/tasks/add</p> 
 <p>When sent with a "Post," request, these routes will allow you to add new employees, and tasks to the database. Therefore, these routes require data is in the form of an object to work properly. ( Think of an object as a completed registration form, that contains information to identify itself).</p>
 
## Put

 <p>/api/employees/update/:empID</p>
 <p>/api/tasks/update/:taskID</p> 
 <p>When sent with a "Put," request, in combination wiht the entry's ID, and an object payload containing the changes, these routes will enable the API to locate, and apply the updates from the payload, to the correct entry in the database</p>

## Delete

 <p>/api/employees/delete</p>
 <p>/api/tasks/delete</p> 
 <p>These routes are similar to ones in the "Put," section, but use the "Delete" prefix, and only requires the entry's ID. This will enable the API to locate, and delete the correct entry in the database</p>
