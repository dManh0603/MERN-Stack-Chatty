import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SideDrawer from '../components/Navigation/SideDrawer';
import { Box } from '@chakra-ui/react'
import { ChatState } from '../contexts/ChatProvider';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const Chatpage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}

      <Box
        display={'flex'}
        justifyContent={'space-between'}
        w={'100%'}
        p={'10px'}
        h={'91.5vh'}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default Chatpage