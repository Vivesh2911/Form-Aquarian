import React, { useState, useEffect } from "react";
import styles from "./Form.css";
import Formimg from "../assets/Formimg.png";
import tick from "../assets/tick.gif";
import Background from "../assets/Background.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const Form = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phone, setPhone] = useState("+91"); // Default to India country code
  const today = new Date();

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const isNotPastDate = (date) => {
    return date >= today.setHours(0, 0, 0, 0);
  };

  useEffect(() => {
    let timer;
    if (submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsFormVisible(false);
            setSubmitted(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleClose = () => {
    setIsFormVisible(false);
    setSubmitted(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    const formData = new FormData(event.target);

    // Validate the date selection
    const selectedDate = formData.get("date");
    const selectedDateObj = new Date(selectedDate);
    const day = selectedDateObj.getDay();

    if (day === 0 || day === 6) {
      alert(
        "Meetings cannot be scheduled on weekends. Please select a weekday."
      );
      return;
    }

    const today = new Date();
    if (selectedDateObj >= today.setHours(0, 0, 0, 0)) {
      alert("The selected date is in the past. Please choose a future date.");
      return;
    }

    // Append the phone number manually
    formData.append("phone", phone);

    formData.append("access_key", "cd83c7c5-591c-4a47-9495-f45538b8b7e7");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const response = await res.json();

      if (response.success) {
        setSubmitted(true);
        setTimeLeft(10); // Start countdown from 10 seconds
      } else {
        setFormError(
          response.message || "Submission failed, please try again."
        );
        alert(response.message || "Submission failed, please try again.");
      }
    } catch (error) {
      setFormError("There was an error submitting the form.");
      alert("There was an error submitting the form.");
    }
  };

  const showForm = () => {
    setIsFormVisible(true);
  };

  function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const isDateDisabled = (date) => {
    const today = new Date();
    const selectedDateObj = new Date(date);
    const day = selectedDateObj.getDay();
    return (
      selectedDateObj < today.setHours(0, 0, 0, 0) || day === 0 || day === 6
    );
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    if (isDateDisabled(date)) {
      e.target.classList.add("datePickerDisabled");
    } else {
      e.target.classList.remove("datePickerDisabled");
    }
    setStartDate(date);
  };

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {isFormVisible ? (
        <div className="formBox">
          {!submitted && (
            <button className="closeButton" onClick={handleClose}>
              &times;
            </button>
          )}
          <div className="left">
            <img src={Formimg} alt="Form" className="image" />
          </div>
          <div className="right">
            {submitted ? (
              <div className="thankYouMessage">
                <img src={tick} alt="tick img" className="tick" />
                <h1>Thank you for your submission!</h1>
                <p>
                  Our team will get back to you with the confirmed appointment
                  details.
                </p>
                <p className="six_second">
                  The form will automatically close in {timeLeft} seconds.
                </p>
                <button className="closeButton" onClick={handleClose}>
                  &times;
                </button>
              </div>
            ) : (
              <>
                <h1 className="heading">Book Appointment</h1>
                <p className="subheading">
                  Reach out and we will get in touch within 24 hours.
                </p>
                {formError && <p className="error">{formError}</p>}
                <form onSubmit={onSubmit}>
                  <div className="formFields">
                    <div className="row">
                      <label htmlFor="firstName" className="label2">
                        *First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="eg. Vivesh"
                        required
                      />
                      <label htmlFor="lastName">*Last Name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="eg. Rajput"
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="emailContainer">
                        <label htmlFor="email" className="label2">
                          *Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="eg. Vivesh2911@gmail.com"
                          required
                          className="emailInput"
                        />
                      </div>
                      <div className="phoneContainer">
                        <label htmlFor="phone" className="label">
                          *Contact Number
                        </label>
                        <div className="phoneInputWrapper">
                          <PhoneInput
                            defaultCountry="IN" // Use ISO code for India
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                            className="customPhoneInput" // Custom class
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <label htmlFor="time" className="label2">
                        *Preferred Time Slot
                      </label>
                      <select
                        id="time"
                        name="time"
                        required
                        className="timeneed"
                      >
                        <option value="">Select time</option>
                        <option value="9 AM - 12 PM">9 AM - 12 PM</option>
                        <option value="12 AM - 3 PM">12 AM - 3 PM</option>
                        <option value="3 AM - 6 PM">3 PM - 6 PM</option>
                        <option value="Anytime">Anytime</option>
                      </select>

                      <div className="dateContainer">
                        <label htmlFor="date" className="label3">
                          *Preferred Date
                        </label>
                        <DatePicker
                          selected={startDate ? new Date(startDate) : null} // If startDate is set, display the date, otherwise show placeholder
                          onChange={(date) => setStartDate(date)}
                          filterDate={(date) =>
                            isWeekday(date) && isNotPastDate(date)
                          }
                          className="datePicker"
                          placeholderText="Select a date" // Placeholder text
                        />
                      </div>
                    </div>

                    <div className="row">
                      <label htmlFor="service" className="label2">
                        *Which Service you are interested in?
                      </label>
                      <select id="service" name="service" required>
                        <option value="">Select service</option>
                        <option value="Permanent Immigration">
                          Permanent Immigration
                        </option>
                        <option value="Buisness Visit">Buisness Visit</option>
                        <option value="Study">Study</option>
                        <option value="Work">Work</option>
                        <option value="Visit">Visit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="row">
                      <label htmlFor="experience" className="label2">
                        *Message/Comments
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        type="text"
                        placeholder="eg. I have 2 years experience."
                        required
                      />
                    </div>
                    <div className="checkboxRow">
                      <input
                        type="checkbox"
                        id="privacyPolicy"
                        name="privacyPolicy"
                        required
                      />
                      <label htmlFor="privacyPolicy">
                        You agree to our friendly <a href="">privacy policy</a>
                      </label>
                    </div>
                    <button type="submit" className="submitButton">
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        <button className="showFormButton" onClick={showForm}>
          Fill the Form
        </button>
      )}
    </div>
  );
};

export default Form;
