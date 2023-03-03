import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Xtable.css";
import { Container, Form } from "react-bootstrap";
// preloader
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaEdit } from "react-icons/fa";
const EditIcon = () => {
  return <FaEdit />;
};
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
      modelitem: [],
      //Edit
      editMode: false,
      editItem: {},
      editIndex: null,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000);
    fetch("http://127.0.0.1:9000/Crud")
      .then((response) => response.json())
      .then((res) => this.setState({ data: res }));
  }

  handleChange = (event) => {
    // console.log("1", event.target);
    const { name, value } = event.target;
    // console.log("2", name, value);
    this.setState({ search: { ...this.state.search, [name]: value } });
    // console.log("3", this.state.search);
  };

  filterData = (itm) => {
    return itm.filter((item) => {
      return(
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

  handleShow = (itm) => {
    this.setState({ modelitem: itm });
    this.setState({ show: true });
  };

  handleEditShow = (itm, index) => {
    this.setState({ editItem: { ...itm }, editMode: true, editIndex: index });
    this.handleShow(itm);
  };

  handleEditClose = () => {
    this.setState({ editMode: false });
    this.handleClose();
  };

  handleEdit = (event) => {
    const { name, value } = event.target;
    this.setState({ editItem: { ...this.state.editItem, [name]: value } });
  };

  handleEditSubmit = () => {
    const data = [...this.state.data];
    data[this.state.editIndex] = { ...this.state.editItem };
    fetch("http://127.0.0.1:9000/Crud")
      .then((response) => response.json())
      .then((res) => this.setState({ data: res }));
  };
  render() {
    console.log(this.state.data)
    this.state.data.map(
    (itm)  => console.log("test",itm.firstName)
      ) 
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
                </div>
                <div className="text-center row-heading">
                  <Row>
                    <Col>
                      <b>ID</b>
                    </Col>
                    <Col>
                      <b>Name</b>
                    </Col>
                    <Col>
                      <b>Email</b>
                    </Col>
                    <Col>
                      <b>Phone</b>
                    </Col>

                    <Col>
                      <b>Gender</b>
                    </Col>
                    <Col>
                      <b>username</b>
                    </Col>
                    <Col>
                      <b>Profile</b>
                    </Col>
                    <Col>
                      <b>Edit</b>
                    </Col>
                  </Row>
                </div>
                {this.filterData(this.state.data).map((itm, index) => {
                  return (
                    <>
                      <div className="row-details text-break">
                        <Row
                        // key={itm.id}
                        // onClick={() => {
                        //   this.handleShow(itm);
                        // }}
                        >
                          {/* <Col>{itm.id}</Col> */}
                          <Col>{itm.firstName + " " + itm.lastName}</Col>
                          <Col>{itm.email}</Col>
                          <Col>{itm.phone}</Col>
                          <Col>{itm.gender}</Col>
                          <Col>{itm.username}</Col>
                          <Col className="table-img">
                            <img src={itm.image} alt="profile-img" />
                          </Col>
                          <Col>
                            <FaEdit
                              onClick={() => this.handleEditShow(itm, index)}
                            />
                          </Col>
                        </Row>
                      </div>
                    </>
                  );
                })}
              </Row>
            </Container>
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
                      <b>Email: </b>
                      {this.state.modelitem.email}
                    </Col>

                    <Col>
                      <b>Phone: </b>
                      {this.state.modelitem.phone}
                    </Col>

                    {/* <Col xs={6}>
                      <b>Address: </b>
                      {this.state.modelitem.address.address}
                    </Col> */}
                    {/* 
                  <Col xs={6}>
                    <b>Company/Address: </b>
                    {modelitem.company.address.address}
                  </Col> */}

                    <Col>
                      <strong>lastName: </strong>
                      {this.state.modelitem.lastName}
                    </Col>

                    {/*---------------------------------------------------------------*/}

                    <Col>
                      <strong>lastName: </strong>
                      {this.state.modelitem.lastName}
                    </Col>

                    <Col>
                      <strong>lastName: </strong>
                      {this.state.modelitem.lastName}
                    </Col>

                    <Col>
                      <strong>lastName: </strong>
                      {this.state.modelitem.lastName}
                    </Col>

                    <Col>
                      <strong>lastName: </strong>
                      {this.state.modelitem.lastName}
                    </Col>

                    {/* <Col className="table-img">
                    <img src={modelitem.imlastName} alt="profile-img" />
                  </Col> */}
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={this.handleEditClose}>
                  Close
                </Button>
                <Button variant="dark" onClick={this.handleEditSubmit}>
                  Edit
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </>
    );
  }
}
