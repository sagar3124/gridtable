import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Xtable.css";
import { Container, Form, Table } from "react-bootstrap";
// preloader
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaEdit, FaPlus, FaTrash  } from "react-icons/fa";

export default class ClassTable extends Component {
  constructor() {
    super();
    this.state = {
      //Table
      data: [],
      editing: null,
      search: { firstName: "", email: "", lastName: "", phone: "" },
      //preloader
      loading: true,
      //Modal
      show: false,
      modelItem: [],
      //Edit
      editMode: false,
      editItem: {},
      editIndex: null,

      // Add
      addData: {},
      showAddModal: false,
      
      sort: {
        field: '',
        order: 'asc'
      }
    };
  }

  async componentDidMount() {
    // some comment

    setTimeout(() => this.setState({ loading: false }), 2000);
    await fetch("http://127.0.0.1:9000/Crud")
      .then((response) => response.json())
      .then((res) => this.setState({ data: res }));

    // some comment;
  }

  handleChange = (event) => {
    // console.log("1", event);
    const { name, value } = event.target;
    // console.log("2", name, value);
    this.setState({ search: { ...this.state.search, [name]: value } });
    // console.log("3", this.state.search);
  };
  handleSort = (field) => {
    const { sort } = this.state;
  
    // if the clicked field is already the active sort field, reverse the order
    const order = field === sort.field && sort.order === 'asc' ? 'desc' : 'asc';
  
    // update the sort state
    this.setState({ sort: { field, order } });
  };
  

  filterData = (itm) => {
    const { field, order } = this.state.sort;
    
    const sortedData = itm.slice().sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return 0;
      }
    });
  
    return sortedData.filter((item) => {
      return (
        item.firstName
          .toLocaleLowerCase()
          .includes(this.state.search.firstName.toLocaleLowerCase()) &&
        item.email
          .toLocaleLowerCase()
          .includes(this.state.search.email.toLocaleLowerCase()) &&
        item.phone.includes(this.state.search.phone) &&
        item.lastName
          .toLocaleLowerCase()
          .includes(this.state.search.lastName.toLocaleLowerCase())
      );
    });
  };
  

  handleClose = () => {
    this.setState({ show: false });
  };

  // Edit function

  handleEditShow = (row, index) => {
    this.setState({ editItem: { ...row }, editMode: false, editIndex: index });
    this.setState({ modelItem: row });
    this.setState({ show: true });
  };

  handleEditClose = () => {
    this.setState({ editMode: false });
    this.handleClose();
  };

  // Add Functions

  handleEdit = (event) => {
    const { name, value } = event.target;
    this.setState({ editItem: { ...this.state.editItem, [name]: value } });
  };

  handleEditSubmit = () => {
    const { data, editIndex, editItem } = this.state;
    const updatedData = [...data];
    updatedData[editIndex] = editItem;

    fetch(`http://127.0.0.1:9000/Crud/${editItem._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editItem),
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({ data: updatedData });
        this.handleClose();
      })
      .catch((error) => console.error(error.message)); // log the error message
  };

  handleAddSubmit = () => {
    const { data, addData } = this.state;
    fetch("http://127.0.0.1:9000/Crud", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addData),
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({ data: [...data, res], showAddModal: false });
      })
      .catch((error) => console.error(error.message));
  };

  handleAddChange = (event) => {
    const { name, value } = event.target;
    this.setState({ addData: { ...this.state.addData, [name]: value } });
  };

  handleDelete = (id) => {
    fetch(`http://127.0.0.1:9000/Crud/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        const filteredData = this.state.data.filter((item) => item._id !== id);
        this.setState({ data: filteredData });
      })
      .catch((error) => console.error(error.message));
  };

  render() {
    // console.log(this.state.data)
    // this.state.data.map(
    // (itm)  => console.log("test",itm.firstName)
    //   )
    return (
      <>
        {/*-------------preloader----------------- */}
        {this.state.loading ? (
          <>
            <div className="preloader">
              <Spinner
                animation="border"
                size="xl"
                variant="success"
                role="status"
              />
              <p>Loading...</p>
            </div>
          </>
        ) : (
          <>
            <Container>
              <Row className="text-center">
                <div className="input-field mt-3 mb-3 py-3 d-flex justify-content-between rounded">
                  <div>
                    <input
                      type="text"
                      list="data-name"
                      name="firstName"
                      placeholder="Search For Name..."
                      onChange={this.handleChange}
                    />
                    <datalist id="data-name">
                      {this.state.data.map((itm) => {
                        return (
                          <option>{itm.firstName + " " + itm.lastName}</option>
                        );
                      })}
                    </datalist>
                  </div>
                  {/*----------------------------------------2----------------------------------*/}
                  <div>
                    <input
                      type="email"
                      list="data-email"
                      name="email"
                      placeholder="Search For Email..."
                      onChange={this.handleChange}
                    />
                    <datalist id="data-email">
                      {this.state.data.map((itm) => {
                        return <option>{itm.email}</option>;
                      })}
                    </datalist>
                  </div>
                  {/*-----------------------------------------3---------------------------------*/}
                  <div>
                    <input
                      type="text"
                      name="phone"
                      list="data-num"
                      placeholder="Search For phone num..."
                      onChange={this.handleChange}
                    />
                    <datalist id="data-num">
                      {this.state.data.map((itm) => {
                        return <option>{itm.phone}</option>;
                      })}
                    </datalist>
                  </div>
                  {/*------------------------------------------4--------------------------------*/}
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      list="data-lastName"
                      placeholder="Search For lastName..."
                      onChange={this.handleChange}
                    />
                    <datalist id="data-lastName">
                      {this.state.data.map((itm) => {
                        return <option>{itm.lastName}</option>;
                      })}
                    </datalist>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="success"
                      onClick={() => this.setState({ showAddModal: true })}
                    >
                      <FaPlus /> Add
                    </Button>
                  </div>
                </div>

                <div className="text-center row-heading">
                  <Row>
                    {/* <Col>
                      <b>ID</b>
                    </Col> */}
                    <Col>
                      <b
                      onClick={() => this.handleSort('firstName')}>Name</b>
                    </Col>
                    <Col>
                      <b
                      onClick={() => this.handleSort('email')}>Email</b>
                    </Col>
                    <Col>
                      <b
                      onClick={() => this.handleSort('phone')}>Phone</b>
                    </Col>

                    <Col>
                      <b
                      onClick={() => this.handleSort('gender')}>Gender</b>
                    </Col>
                    <Col>
                      <b
                      onClick={() => this.handleSort('username')}>Username</b>
                    </Col>
                    <Col>
                      <b>Profile</b>
                    </Col>
                    <Col>
                      <b>Edit/Delete</b>
                    </Col>
                  </Row>
                </div>
                {this.filterData(this.state.data).map((row, index) => {
                  return (
                    <>
                      <div className="row-details text-break">
                        <Row>
                          {/* <Col>{itm.id}</Col> */}
                          <Col>{row.firstName + " " + row.lastName}</Col>
                          <Col>{row.email}</Col>
                          <Col>{row.phone}</Col>
                          <Col>{row.gender}</Col>
                          <Col>{row.username}</Col>
                          <Col className="table-img">
                            <img src={row.image} alt="profile-img" />
                          </Col>

                          <Col>
                            
                              
                            <FaEdit
                            className="me-5"
                            style={{marginTop: "17px"}}
                              onClick={() => this.handleEditShow(row, index)}
                            />
                            <FaTrash
                            style={{marginTop: "17px"}}
                              variant="danger"
                              onClick={() => this.handleDelete(row._id)}
                            
                              
                            />
                            
                          </Col>
                          
                        </Row>
                      </div>
                    </>
                  );
                })}
              </Row>
            </Container>
            {/* Edit Modal */}
            <Modal
              show={this.state.show}
              onHide={this.handleClose}
              className="modal-xl"
            >
              <Modal.Header closeButton>
                <Modal.Title className="text-primary">User Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row md={2}>
                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={this.state.editItem.firstName}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Enter first name"
                            value={this.state.editItem.lastName}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="text"
                            name="email"
                            placeholder="Enter first name"
                            value={this.state.editItem.email}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>

                    {/*---------------------------------------------------------------*/}

                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            placeholder="Enter first name"
                            value={this.state.editItem.phone}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>Gender</Form.Label>
                          <Form.Control
                            type="text"
                            name="gender"
                            placeholder="Enter first name"
                            value={this.state.editItem.gender}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>User Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="Enter first name"
                            value={this.state.editItem.username}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col>
                      <Form>
                        <Form.Group controlId="formFirstName">
                          <Form.Label>Profile</Form.Label>
                          <Form.Control
                            type="text"
                            name="image"
                            placeholder="Enter first name"
                            // disabled
                            value={this.state.editItem.image}
                            onChange={this.handleEdit}
                          />
                        </Form.Group>
                      </Form>
                    </Col>
                    {/* <Col className="table-img">
                    <img src={modelItem.imlastName} alt="profile-img" />
                  </Col> */}
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={this.handleClose}>
                  Close
                </Button>
                <Button variant="dark" onClick={this.handleEditSubmit}>
                  Edit
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
        {/* Add Modal */}
        <Modal
          show={this.state.showAddModal}
          onHide={() => this.setState({ showAddModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add new data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  onChange={this.handleAddChange}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  onChange={this.handleAddChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={this.handleAddChange}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  name="phone"
                  onChange={this.handleAddChange}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  onChange={this.handleAddChange}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Gender"
                  name="gender"
                  onChange={this.handleAddChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showAddModal: false })}
            >
              Close
            </Button>
            <Button variant="primary" onClick={this.handleAddSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
