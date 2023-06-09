import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children
                ? (<span onClick={onOpen}>{children}</span>)
                : (
                    <IconButton
                        display={{ base: 'flex' }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                    />
                )}


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'32px'}
                        fontFamily={'Work sans'}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Image
                            borderRadius={'full'}
                            boxSize={'100px'}
                            src={user.avt}
                            alt={user.name}
                        />

                        <Text
                            mt={'4'}
                            fontSize={{ base: '16px', md: '20px' }}
                            fontFamily={'Work sans'}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModal