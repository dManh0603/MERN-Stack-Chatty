import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../contexts/ChatProvider'
import UserBadgeItem from '../UserList/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserList/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const { selectedChat, setSelectedChat, user } = ChatState()
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const toast = useToast();

  const handleRemove = async (removedUser) => {
    if (selectedChat.groupAdmin._id !== user._id && removedUser._id !== user._id) {
      toast({
        title: 'Only admin can remove someone!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.put('/api/chat/group/remove', {
        chatId: selectedChat._id,
        userId: removedUser._id,
      }, config);

      removedUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      fetchMessages();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Something went wrong. Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
      setLoading(false);

    }

  }

  const handleAddUser = async (newUser) => {

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admin can add someone!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    if (selectedChat.users.find(u => u._id === newUser._id)) {
      toast({
        title: 'User already in the group',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.put('/api/chat/group/add', {
        chatId: selectedChat._id,
        userId: newUser._id,
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);

    } catch (error) {
      console.log(error);
      toast({
        title: 'Something went wrong. Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
      setLoading(false);

    }

  }

  const handleRename = async () => {
    if (!groupChatName) { return };

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };

      const { data } = await axios.put('/api/chat/group/rename', {
        chatId: selectedChat._id,
        chatName: groupChatName,
      }, config)

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong. Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
      setRenameLoading(false)

    }
    setGroupChatName('');
  }

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
      console.log(error);
      toast({
        title: 'Something went wrong. Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
    }

  }



  return (
    <>
      <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={'35px'}
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={'center'}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w={'100%'}
              display={'flex'}
              flexWrap={'wrap'}
              pb={3}
            >
              {selectedChat.users.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />))}
            </Box>

            <FormControl display={'flex'}>
              <Input
                placeholder='Chat name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={'solid'}
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl display={'flex'}>
              <Input
                placeholder='Add user to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading
              ? (<Spinner size={'lg'} />)
              : (
                searchResult?.map(u => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
              )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave group
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal