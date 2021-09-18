# JavaScript Ajax RestApi
This is a simple RestApi that runs on a Express server.
This documentation is written with non technical people in mind, therefore it may be a bit more verbose than what programmers may expect.
<div>
      <img width="700" src="https://user-images.githubusercontent.com/44081182/133871712-6b2129de-96c3-4ec4-bf6f-6d86b0b61e45.PNG">
</div>

# npm start
You run this command within the project folder, through the use of the command prompt terminal.
For exemple: C:/user/desktop/[web app project folder]/ npm start
Doing so will allow you to view the web application at this link: http://localhost:8080/

# Api Routes
<p>/api/employees</p>
<p>/api/tasks</p>
These are the main routes which will allow you to execute various CRUD (create, read, update, delete) procedures

## Get

 <h3>/api/employees</h3>
 <h3>/api/tasks</h3>
  <p>You may make a "Get," request using these routes, to fetch all the employees, and tasks respectively</p>
 <br/>

 <h3>/api/employees/search</h3>
 <h3>/api/tasks/search</h3> 
   <p>These routes are similar to the ones above, however they require some search parameters before you can submit this with a "Get," request.</p>
    <p>For the "employees," route, you need to provide two parameters: a first name, and last name.</p>
     <p>For the "tasks," route, you need to provide only the task name.</p>
 <br/>
 
## Post

 <p>/api/employees/register</p>
 <p>/api/tasks/add</p>
 
## Put

 <p>/api/employees/update</p>
 <p>/api/tasks/update</p> 

## Delete

 <p>/api/employees/delete</p>
 <p>/api/tasks/delete</p> 

