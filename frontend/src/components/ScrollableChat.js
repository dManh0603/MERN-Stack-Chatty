import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin } from '../helpers/ChatHelper'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../contexts/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react';


const ScrollableChat = ({ messages }) => {

  const { user } = ChatState();

  return <ScrollableFeed>
    {messages && messages.map((m, i) => (
      <div style={{ display: 'flex' }} key={m._id}>
        {
          (isSameSender(messages, m, i, user._id)
            || isLastMessage(messages, i, user._id)
          )
          && (
            <Tooltip
              label={m.sender.name}
              placement='bottom-start'
              hasArrow
            >
              <Avatar
                mt={'7px'}
                mr={1}
                mb={1}
                size={'sm'}
                cursor={'pointer'}
                name={m.sender.name}
                src={m.sender.avt}
              />
            </Tooltip>
          )}

        <span
          style={{
            backgroundColor: `${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
            borderRadius: '16px',
            padding: '4px 16px',
            maxWidth: '75%',
            marginLeft: isSameSenderMargin(messages, m, i, user._id),
            marginBottom: '2px'
          }}

        > {m.content}</span>
      </div>
    ))}
  </ScrollableFeed>
}

export default ScrollableChat