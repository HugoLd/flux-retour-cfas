import { Box, Flex, Link, Spacer, Spinner, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";

import useDownloadClick from "../../hooks/useDownloadClick";

const DownloadBlock = ({ title, description, fileName, getFile }) => {
  const [onClick, isLoading] = useDownloadClick(getFile, fileName);
  const fileFormatOrName = fileName?.split(".").pop().toUpperCase();

  return (
    <Link style={{ textDecoration: "none" }} onClick={onClick}>
      <Box
        background="white"
        fontSize="gamma"
        width="100%"
        paddingY="4w"
        paddingX="4w"
        border="1px solid"
        borderColor="#E5E5E5"
        fontWeight="bold"
        flex="1"
      >
        {isLoading && (
          <Box>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Box>
        )}
        {!isLoading && (
          <Box>
            <Text color="black" marginBottom="2w">
              {title}
            </Text>
            <Text color="#3A3A3A" fontWeight="400" marginBottom="2w" fontSize="zeta">
              {description}
            </Text>
            <Flex>
              <Text color="#666666" fontWeight="400" marginBottom="2w" fontSize="omega">
                {fileFormatOrName}
              </Text>
              <Spacer />
              <Box as="i" className="ri-download-line" fontWeight="400" />
            </Flex>
          </Box>
        )}
      </Box>
    </Link>
  );
};

DownloadBlock.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  getFile: PropTypes.func.isRequired,
};

export default DownloadBlock;
