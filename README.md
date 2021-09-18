# JavaScript Ajax RestApi
This is a simple RestApi that runs on a Express server.
This documentation is written with non technical people in mind, therefore it may be a bit more verbose than what programmers may expect.
<div>
      <img width="700" src="https://user-images.githubusercontent.com/44081182/133871712-6b2129de-96c3-4ec4-bf6f-6d86b0b61e45.PNG">
</div>

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
  <p>When sent with a "Get," request, these routes will fetch all the employees, and tasks, from their individual lists in the database</p>
  
## 

 <h3>/api/employees/search</h3>
 <h3>/api/tasks/search</h3> 
 <p>These routes are similar to the ones above, however they require some search parameters before you can submit this with a "Get," request.</p>
 <p>For the "employees," route, you need to provide two parameters: a first name, and last name.</p>
 <p>For the "tasks," route, you need to provide only the task name.</p>
 <p>A typical use case for this type of route, would be if you wanted to load the full data for a specific employee, or task, that you see in the list. The reason for this is that some databases have two versions of the same data. One light version for quick retrieval, and a dense one that contains the full data for each entry in a list. Trying to load that version, especially if it contains thousands of entries, would result in potential slowdowns when displaying the data. Therefore, it is better to load the light version for when you want quickly list all entries, and then only at the users request, use the entry's data in the lighter list, to look up it's full information in the heavier one.</p>
 <h6>*Please note, as this project develops, the parameters for these routes are subject to change. All revisions will be reflected in this description.*</h6>
 <br/>
 
## Post

 <p>/api/employees/register</p>
 <p>/api/tasks/add</p> 
 <p>When sent with a "Post," request, these routes will allow you to add new employees, and tasks to the database. Therefore, these routes require data is in the form of an object to work properly. ( Think of an object as a completed registration form, that contains information to identify itself).</p>
 
## Put

 <p>/api/employees/update/:empID</p>
 <p>/api/tasks/update/:taskID</p> 
 <p>When sent with a "Put," request, as well as the entry's ID as a parameter, these routes will enable the API to locate, and apply the updates to the correct entry in the database</p>

## Delete

 <p>/api/employees/delete</p>
 <p>/api/tasks/delete</p> 
 <p>These routes are similar to ones in the "Put," section, but use the "Delete" prefix instead. This will enable the API to locate, and delete the correct entry in the database</p>
