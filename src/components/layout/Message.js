import React, { useEffect, useState } from 'react';
import bus from '../../utils/bus';
import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';

/* css */
import styles from './Message.module.scss';

function Message() {
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [, setTimer] = useState(1);

  useEffect(() => {
    bus.addListener('flash', ({ message, type }) => {
      setVisibility(true);
      setMessage(message);
      setType(type);
      setTimer(prev => {
        clearTimeout(prev);
        clearTimeout(prev - 1);
        return setTimeout(() => {
          setVisibility(false);
        }, 4000);
      });
    });
  }, []);

  useEffect(() => {
    if (document.querySelector('.close') !== null) {
      document
        .querySelector('.close')
        .addEventListener('click', () => setVisibility(false));
    }
  });

  return (
    visibility && (
      <div className={styles.message}>
        <div className={` ${styles[type]} close`}>
          {type === 'error' ? (
            <BsFillExclamationCircleFill />
          ) : (
            <BsFillCheckCircleFill />
          )}
          <p>{message}</p>{' '}
          <span>
            <CgClose />
          </span>
        </div>
      </div>
    )
  );
}

export default Message;
