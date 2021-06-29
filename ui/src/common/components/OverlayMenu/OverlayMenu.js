import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

const OverlayMenu = ({ onClose, children }) => {
  const menuRef = useRef(null);
  const [menuMaxHeight, setMenuMaxHeight] = useState("100%");

  useEffect(() => {
    // compute max-height for menu considering viewport, current y axis position and the 16px marginTop
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const menuHeight = menuRef?.current
      ? `${viewportHeight - menuRef.current.getBoundingClientRect().y - 16}px`
      : "100%";

    setMenuMaxHeight(menuHeight);
  });

  return (
    <div>
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        backgroundColor="rgba(0, 0, 0, 0.05)"
        onClick={onClose}
        zIndex="99"
      ></Box>
      <Box
        position="absolute"
        background="white"
        left="15w"
        right="15w"
        marginTop="2w"
        paddingX="8w"
        paddingY="3w"
        boxShadow="0px 0px 16px rgba(30, 30, 30, 0.16)"
        borderRadius="0.25rem"
        zIndex="100"
        ref={menuRef}
        maxHeight={menuMaxHeight}
      >
        {children}
      </Box>
    </div>
  );
};

OverlayMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default OverlayMenu;
