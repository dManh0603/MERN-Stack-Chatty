import React, { useEffect, useState } from 'react'
import { ChatState } from '../contexts/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSenderFull, getSender } from '../helpers/ChatHelper'
import ProfileModal from '../components/miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { } from './style.css'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast({
                title: 'Error retrieving your chats',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
            });

        }
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    }
                }

                setNewMessage('');
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,

                }, config);

                setMessages([...messages, data]);

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
        }

    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

    }

    return (<>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{ base: '28px', md: '32px' }}
                    pb={3}
                    px={2}
                    w={'100%'}
                    fontFamily={'Work sans'}
                    display={'flex'}
                    justifyContent={{ base: 'space-between' }}
                    alignItems={'center'}
                >
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat('')}
                    />

                    {!selectedChat.isGroupChat
                        ? (<>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>)
                        : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                </Text>
                <Box
                    display={'flex'}
                    flexDir={'column'}
                    justifyContent={'flex-end'}
                    p={2}
                    bg={'#E8E8E8'}
                    w={'100%'}
                    h={'100%'}
                    borderRadius={'lg'}
                    overflowY={'hidden'}
                >
                    {loading
                        ? (
                            <Spinner
                                size={'xl'}
                                w={20}
                                h={20}
                                alignSelf={'center'}
                                margin={'auto'}
                            />
                        )
                        : (
                            <>
                                <div className='messages'>
                                    <ScrollableChat messages={messages} />
                                </div>

                                <FormControl onKeyDown={sendMessage}>
                                    <Input
                                        mt={2}
                                        bg={'white'}
                                        placeholder='Type here ...'
                                        onChange={typingHandler}
                                        value={newMessage}
                                    />

                                </FormControl>
                            </>
                        )}

                </Box>
            </>
        ) : (
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                h={'100%'}
            >
                <Text fontSize={'3xl'} pb={3} fontFamily={'Work sans'}>
                    Choose a friend to start chatting.
                </Text>
            </Box>
        )}
    </>)
}

export default SingleChat