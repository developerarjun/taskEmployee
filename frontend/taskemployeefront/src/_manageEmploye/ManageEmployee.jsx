import React,{useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { userService } from '../_services';

const initialState = {
    fullname: '',
    dob: '',
    gender: '',
    salary: '',
    designation: '',
    Profileimage: '',
    submitted: false,
    loggingIn : false,
    alert: false,
    Success: false,
    buttonaddupdate: 'Add',
    id: '',
    selectedItem: 1,
    PageStartFrom: 0,
    PageEndTo : 4,
    userList: [],
    selectedFiles : ''
}

class ManageEmployee extends React.Component {
 
    constructor(props) {
        super(props);

        this.state = initialState;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.selectFile = this.onFileChange.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(userActions.getEmployeeAll());
    }
    handleChange(e) {
        const { name, value } = e.target;
        if(name == 'salary')
        {
            const re = /^[0-9.\b]+$/;
            if (e.target.value === '' || re.test(e.target.value)) {
               this.setState({[name]: e.target.value})
            }
        }else{
            this.setState({[name]: e.target.value})
        }
    }
    searchData(e){
            var value = e.target.value.toLowerCase();
            $("#employeebody tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { fullname, dob, gender , salary,designation,
            profileimage,id,buttonaddupdate } = this.state;
        const { dispatch } = this.props;
        if (fullname && dob &&  gender && salary && designation ) {
            this.setState({ loggingIn: true });
            if(buttonaddupdate == 'Update' && id != ''){
                var emp = {
                    id: id,
                    fullname : fullname,
                    dob : dob,
                    gender : gender,
                    salary : salary,
                    designation : designation,
                    profileimage: profileimage,
                }
                userService.UpdateEmployee(emp,id)
                .then(
                    user => { 
                        this.reset(user);
                        this.setState({Success : user});
    
                    },
                    error => {
                        this.setState({ alert: error });
                    }
                    );
            }
            else{
            var emp = {
                fullname : fullname,
                dob : dob,
                gender : gender,
                salary : salary,
                designation : designation,
                profileimage: profileimage,
                importedBy: JSON.parse(localStorage.getItem("user")).username
            }
            userService.AddEmployee(emp)
            .then(
                user => { 
                    this.reset(user);
                    this.setState({Success : user});

                },
                error => {
                    this.setState({ alert: error });
                }
                );
            }
            this.setState({ loggingIn: false });
            
        }
    }
    reset(success) {
        this.setState(initialState);
        this.props.dispatch(userActions.getEmployeeAll());
    }
    updateState(a){
        this.setState({dob: a.dob});
        this.setState({salary: a.salary});
        this.setState({designation: a.designation});
        this.setState({fullname: a.fullName});
        this.setState({gender: a.gender});
        this.setState({id: a.id});
        this.setState({profileimage: a.profileimage ==undefined? '': a.profileimage});
        this.setState({buttonaddupdate: 'Update'});
    }
        
    onPageClick(a){
        this.setState({selectedItem: a});
        const itemOffset = this.state.PageEndTo;
        const endOffset = this.state.PageEndTo + 4;
        this.setState({PageStartFrom: itemOffset});
        this.setState({PageEndTo: endOffset });
    
    }
    onFileChange(event) {
        const reader = new FileReader(); 
        if(event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          if(file.size < 4194304 ){
          reader.readAsDataURL(file);
          this.setState({profileimage : reader.result});
        }else{
            alert('image only be 4mb size');
        }
        }
    }
    UploadExcel(event) {
        e.preventDefault();
        const { selectedFiles } = this.state;
        var d = {
            selectedFiles,
            UploadBy: JSON.parse(localStorage.getItem("user")).username
        }
        userService.UploadExcel(d)
            .then(
                user => { 
                    this.reset(user);
                    this.setState({Success : user});

                },
                error => {
                    this.setState({ alert: error });
                }
                );
            }
    selectFile(e) {
        const { name } = e.target;
        this.setState({[name]: e.target.files})
    }
    render() {
        const { users } = this.props;
        const { fullname, dob, gender, salary,
            designation,profileimage,submitted,loggingIn,alert,Success,
            buttonaddupdate,
            PageStartFrom,PageEndTo,selectedItem,userList,selectedFiles 
        } = this.state;
       
        const items =[1,2,3,4,5,6];
        return (
        <div>
      <form name="form" onSubmit={this.handleSubmit}>
      <div className="form-group">
        <label htmlFor="Profile">Excel File Upload</label>
        <input type="file" className="form-control" id="Profile" name="profileimage"
            onChange={this.selectFile} value={selectedFiles }
        />
       <br/>
    <button className="btn btn-success" onClick={this.UploadExcel}>
      Upload
    </button>
        </div>
      { alert && <div className="alert alert-danger">{alert.message}</div>
        }
        {Success && <div className="alert alert-success">{Success.message}</div>}
        <div className="row">
        <div className="col-md-6">
       
        <div className={'form-group' + (submitted && !fullname ? ' has-error' : '')}>
        <label htmlFor="exampleFullName">Full Name</label>
        <input type="text" className="form-control" id="exampleFullName"
         aria-describedby="fullName" placeholder="Enter Full Name" name="fullname" value={fullname}
          onChange={this.handleChange} 
         />
        {submitted && !fullname &&
            <div className="help-block">Full Name is required</div>
        }
        </div>
        <div className="form-group">
        <label htmlFor="dob">Date Of Birth</label>
        <input type="date" className="form-control" id="dob"  aria-describedby="dob" 
        placeholder="yyyy-mm-dd" name="dob" value={dob} onChange={this.handleChange} />
        {submitted && !dob &&
            <div className="help-block">DOB is required</div>
        }
        </div>
        <div className="form-group">
        <label htmlFor="Gender">Gender</label>
        <input type="text" className="form-control" id="Gender" 
        aria-describedby="Gender" placeholder="Enter Gender" name="gender" value={gender} onChange={this.handleChange}  />
        {submitted && !gender &&
            <div className="help-block">Gender is required</div>
        }
        </div>
        </div>
        <div className="col-md-6">
        <div className="form-group">
        <label htmlFor="Salary">Salary</label>
        <input type="text" className="form-control" id="Salary" 
        aria-describedby="Salary" placeholder="Enter Salary" name="salary"
        value={salary} onChange={this.handleChange}  />
        {submitted && !salary &&
            <div className="help-block">Salary is required</div>
        }
        </div>
        <div className="form-group">
        <label htmlFor="designation">Designation</label>
        <input type="text" className="form-control" id="designation" 
        aria-describedby="designation" name="designation" placeholder="Enter Designation" value={designation} onChange={this.handleChange}  />
        {submitted && !designation &&
            <div className="help-block">Designation is required</div>
        }
        </div>
        <div className="form-group">
        <label htmlFor="Profile">Profile Image</label>
        <input type="file" className="form-control" id="Profile" name="profileimage"
        onBlur={this.onFileChange}
        />
       
        <div id="fileDisplayArea"></div>
        </div>
        {buttonaddupdate == 'Add' &&<button className="btn btn-primary">Add Employee</button>}
        {buttonaddupdate == 'Update' &&<button className="btn btn-primary">Update Employee</button>}

        {loggingIn &&
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        }
        </div>
         </div>
         </form>
         {users.loading && <em>Loading Employee...</em>}
         <label htmlFor="Profile">Search:</label>

         <input type="text" id="search" onKeyUp={this.searchData} placeholder="Type to search"/>
         
         {users.items &&
         <table className="table table-striped" id="empdata">
            <thead>
            <tr>
            <th scope="col">fullName</th>
            <th scope="col">dob</th>
            <th scope="col">gender</th>
            <th scope="col">salary</th>
            <th scope="col">designation</th>
            <th scope="col">employeeImage</th>
            <th scope="col">importedBy</th>
            <th scope="col">importedDate</th>
            <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody id="employeebody">
            {users.items.slice(PageStartFrom,PageEndTo).map((user, index) =>
            <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.dob}</td>
                <td>{user.gender}</td>
                <td>{user.salary}</td>
                <td>{user.designation}</td>
                <td> <img src={user.profileimage} width="50" height="50"/> </td>
                <td>{user.importedBy}</td>
                <td>{user.importedDate}</td>
                <td>
                    <button className="btn btn-success" 
                     onClick={() => this.updateState(user)}>Edit</button></td>
            </tr>
             )}
            </tbody>
            </table>
            
        }
         <div className="pagination">
            {items.map((l,index) =>
                <a key={index} onClick={() => this.onPageClick(l)} className={l === this.state.selectedItem ? 'active' : null}>{l}</a>
                )}
            </div>
            </div>
 );
 
    }
}
function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedManageEmployee = connect(mapStateToProps)(ManageEmployee);
export { connectedManageEmployee as ManageEmployee };