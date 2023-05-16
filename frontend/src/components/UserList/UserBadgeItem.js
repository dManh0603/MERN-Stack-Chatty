import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={'lg'}
            m={1}
            mb={2}
            variant='solid'
            fontSize={12}
            bgColor={'#42d0fe'}
            cursor={'pointer'}
            onClick={handleFunction}

        >
            {user.name}
            <CloseIcon ml={2} />
        </Box>
    )
}

export default UserBadgeItem