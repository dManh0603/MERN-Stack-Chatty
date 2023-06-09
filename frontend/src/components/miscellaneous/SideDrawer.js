import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { ChatState } from '../../contexts/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserList/UserListItem';
import { getSender } from '../../helpers/ChatHelper';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

  const searchHandler = async () => {
    if (!search) {
      toast({
        title: 'Please enter name or email to search',
        status: 'warning',
        duration: 1000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something wrong. Please try again later!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log('access chat')

      const { data } = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error retrieving your chats',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'white'}
        w={'100%'}
        p={'5px 10px 5px 10px'}
        borderWidth={'5px'}
      >
        <Tooltip
          label='Search for others'
          hasArrow
          placement='bottom-end'
        >
          <Button variant={'ghost'} onClick={onOpen}>
            <SearchIcon />
          </Button>
        </Tooltip>

        <Text fontSize={'2xl'} fontFamily={'Work sans'}>
          MERN Stack Chatty
        </Text>

        <div>
          <Menu>
            <MenuButton p={'1'}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={'2xl'} m={'1'} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map(notif => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter(n => n !== notif))
                }}>
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `${getSender(user, notif.chat.users)} sent you a new message`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>

            <MenuButton as={'button'} righticon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.avt} />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>
            Search for other users
          </DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} pb={'2'}>
              <Input
                placeholder='Search by name or email'
                mr={'2'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button
                onClick={searchHandler}
              >
                <SearchIcon /></Button>
            </Box>
            {loading
              ? (<ChatLoading />)
              : (
                searchResult?.map(u => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => accessChat(u._id)}
                  />
                ))
              )
            }

            {loadingChat && <Spinner ml={'auto'} display={'flex'} />}

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer