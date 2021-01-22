import React from "react";
import $ from "jquery";
import "eonasdan-custom-bootstrap-datetimepicker-with-bootstrap-4/src/js/bootstrap-datetimepicker.js";
import 'moment/locale/th';
import uuid from "uuid";
const uuidV4 = uuid.v4;
const defaultPickerOptions = {
  viewMode: "years",
  allowInputToggle: false,
  locale: "en",
  format: "L LTS",
  calendarWeeks: false,
  toolbarPlacement: "default",
  tooltips: {
    today: "Go to today",
    clear: "Clear selection",
    close: "Close the picker",
    selectMonth: "Select Month",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    selectYear: "Select Year",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    selectDecade: "Select Decade",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevCentury: "Previous Century",
    nextCentury: "Next Century",
  },
  icons: {
    time: 'fas fa-clock',
    date: 'fas fa-calendar',
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check-o',
    clear: 'fas fa-trash',
    close: 'fas fa-times'
},

  widgetPositioning: { horizontal: "auto", vertical: "bottom" },
  focusOnShow: true,
  keepOpen:true,
};

class Bootstrapdatepicker extends React.Component {
  
  static defaultProps = {
    id: "react-datetime-bootstrap",
    onChange: () => null,
    pickerOptions: { ...defaultPickerOptions },
  };
  arePropsUpdating = false;
  componentWillMount() {
    const { id: componentId = "date-time-picker" } = this.props;
    this.id = `${componentId}-${uuidV4()}`;
  }
  componentDidMount() {
    const { value, onChange } = this.props;
    const { id } = this;
    let { pickerOptions } = this.props;
    pickerOptions = { ...defaultPickerOptions, ...pickerOptions };
    this.datePickerElement = $(`#${id}`);
    this.dateTimePicker = this.datePickerElement.datetimepicker(pickerOptions);
    this.datePicker = this.datePickerElement.data("DateTimePicker");
  }

  render() {
    const {
      name,
      placeholder,
      disabled,
      required,
      readOnly,
      bsStyle,
      id: componentId = "date-time-picker",
      className = "",
    } = this.props;
    const { id } = this;
    const bsClass = bsStyle ? `has-${bsStyle}` : "";
    return (
      <div
        style={{ position: "relative" }}
        id={componentId}
      >
        <input
          id={id}
          className={`${className} form-control  date-time`}
          type="text"
          name={name}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export { Bootstrapdatepicker };
