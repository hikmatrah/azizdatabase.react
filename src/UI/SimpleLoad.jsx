import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStylesFacebook = makeStyles(() => ({
  circle: {
    strokeLinecap: "round",
  },
}));

const FacebookCircularProgress = ({
  circleColor,
  duration,
  size,
  thickness,
}) => {
  const classes = useStylesFacebook();
  return (
    <CircularProgress
      variant="indeterminate"
      style={{ color: circleColor, animationDuration: `${duration}ms` }}
      classes={{
        circle: classes.circle,
      }}
      size={size}
      thickness={thickness}
    />
  );
};

const SimpleLoad = ({ circleColor, duration, size, thickness }) => {
  return (
    <>
      <FacebookCircularProgress
        circleColor={circleColor}
        duration={duration}
        size={size}
        thickness={thickness}
      />
    </>
  );
};

SimpleLoad.propTypes = {
  circleColor: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  thickness: PropTypes.number.isRequired,
};
SimpleLoad.defaultProps = {
  circleColor: "#4481eb",
  duration: 1000,
  size: 20,
  thickness: 4,
};

export default SimpleLoad;
