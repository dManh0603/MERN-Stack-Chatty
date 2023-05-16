import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../contexts/ChatProvider'
import axios from 'axios';
import UserListItem from '../UserList/UserListItem'
import UserBadgeItem from '../UserList/UserBadgeItem';

const GroupChatModal = ({ children }) => {

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {

    if (!query) { return; };

    setSearch(query);

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config)
      console.log('search', data);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: 'Something went wrong. Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
    }

  }
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };

      selectedUsers.push(user)
      console.log(selectedUsers)
      const { data } = await axios.post('/api/chat/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(u => u._id))
      }, config);

      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New group chat created!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      })

    } catch (error) {
      toast({
        title: 'Something went wrong. Please try again later!',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    }
  }

  const handleDelete = (deletedUser) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== deletedUser._id))
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={'36px'}
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={'center'}
          >
            Create new group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
          >
            <FormControl>
              <Input
                placeholder='Chat name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add users'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
              {selectedUsers.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}

            </Box>
            {loading ? <div>Loading...</div> : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal