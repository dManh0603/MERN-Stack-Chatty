import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../helpers/ChatHelper';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { ChatState } from '../contexts/ChatProvider';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/chat', config);
        console.log(data)
        setChats(data);
      } catch (error) {
        console.log(error);
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

    const user = JSON.parse(localStorage.getItem('userInfo'));
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <Box
      display={{ base: !selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: '16px', md: '12px', lg: '16px' }}
            rightIcon={<AddIcon />}
          >
            New group chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats.length > 0
          ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py="4px"
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          )
          : (
            // <ChatLoading />
            <div>
              You have no chats.
            </div>
          )}
      </Box>
    </Box>
  );
};

export default MyChats;
