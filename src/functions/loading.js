import React from "react";
function Loading(props) {
  return (
    <>
      <div
        className={props.isLoading ? "parentDisable" : "d-none"}
        width="100%"
      >
        <div className="overlay-box">
          <div className="fa-4x">
            <i className="fas fa-circle-notch fa-spin"></i>
          </div>
        </div>
      </div>
    </>
  );
}
export default Loading;
