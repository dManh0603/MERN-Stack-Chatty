import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {

    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [avt, setAvt] = useState()

    const handleClick = () => setShow(!show)
    const avtDetails = (picture) => {

    }
    const submitHandler = () => {

    }

    return (
        <VStack spacing={'5px'}>
            <FormControl id='username' isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                    placeholder='Enter your username'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement w={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Re-enter your password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </InputGroup>
            </FormControl>

            <FormControl id='avt'>
                <FormLabel>Upload your avatar</FormLabel>
                <Input
                    type='file'
                    p={'1.5'}
                    accept='image/*'
                    onChange={(e) => avtDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme='teal'
                w={'100%'}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >
                Sign up now !
            </Button>
        </VStack>
    )
}

export default Signup