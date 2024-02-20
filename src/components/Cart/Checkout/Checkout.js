import { useState, useEffect } from 'react';
import {
  Button,
  Header,
  Segment,
  Modal,
  Image,
  Input,
  Label,
  Form,
} from 'semantic-ui-react';
import styled from 'styled-components';
import Shop from '../../../views/Shop';
import { useLocation } from 'react-router-dom';

const StyledCheckout = styled(Segment)`
  display: flex;
  flex-direction: column;
  & > .header {
    margin: 0 !important;
  }
  & dt {
    text-align: right;
    width: max-content;
  }
  & dl {
    display: flex;
    justify-content: space-between;
    gap: 2px 4px;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    padding: 3px 0;
  }
  & dd {
    width: max-content;
  }
`;

const StyledButtons = styled(Segment)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ItemCount = styled.div`
  color: gray;
  font-weight: 300;
`;
export default function Checkout({
  totalCost,
  getTotalItems,
  cart_id,
  resetCart,
}) {
  const fin_pay_url = process.env.REACT_APP_CHECKOUT_URL;
  const shop_url = process.env.PUBLIC_URL;
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [transactionComplete, setComplete] = useState(false);
  const complete_cart_id =
    new URLSearchParams(location.search).get('fulfill');

  useEffect(() => {
    if (!!complete_cart_id) {
      console.log('Bob is your uncle');
      setComplete(true);
      resetCart();
    }
  }, [complete_cart_id]);

  const baseURL = window.location.href;

  const checkoutWithFinPay = () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      a: totalCost,
      crr: 'paybill', //paybill or buygoods
      partyB: '542542',
      billRef: 'JohnDoe',
      p: phoneNumber,
      on: cart_id,
      redirectTo: baseURL + '?fulfill=' + cart_id,
    });

    console.log('Here are the query params', queryParams.toString());

    // Redirect the user to the payment site with the query parameters
    window.open(`${fin_pay_url}?${queryParams.toString()}`);
    setLoading(false);
    setOpenPaymentDetails(false);
  };

  const closeModal = () => {
    setOpenPaymentDetails(false);
    setPhoneNumber('');
  };

  return (
    <StyledCheckout>
      <Header>Estimated Costs</Header>
      <dl>
        <dt>
          SubTotal:
          <ItemCount>{`(${getTotalItems()} items)`}</ItemCount>
        </dt>
        <dd>{` R${totalCost}`}</dd>
      </dl>
      <p>No tax included</p>
      <dl>
        <dt>Estimated Total:</dt>
        <dd>
          <strong>{` R${totalCost}`}</strong>
        </dd>
      </dl>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Button
          color='green'
          onClick={() => {
            window.location.href = `https://qa-client.fin-connect.net/apply?product=35&merchant=a267e0d0-b1ea-49e1-b307-d87ecb6109eb&amount=${totalCost}&term=6`;
          }}
        >
          Checkout with Fin
        </Button>
        <Button
          color='green'
          onClick={() => {
            setOpenPaymentDetails(true);
          }}
        >
          Checkout with Fin Pay
        </Button>
      </div>
      <Modal
        onClose={() => closeModal()}
        onOpen={() => setOpenPaymentDetails(true)}
        open={openPaymentDetails}
        size='tiny'
      >
        <Modal.Header>Checkout with Fin Pay</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Please enter your phone number to checkout:</Header>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 'fit-content',
              }}
            >
              {/* <Label pointing='below'>Phone number</Label> */}
              <Input
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='0712345678...'
              />
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button
            content='Confirm'
            labelPosition='right'
            icon='checkmark'
            disabled={phoneNumber.length < 10 || loading}
            onClick={() => checkoutWithFinPay()}
            positive
          />
        </Modal.Actions>
      </Modal>
      <Modal
        onClose={() => setComplete(false)}
        onOpen={() => setComplete(true)}
        open={transactionComplete}
        size='tiny'
      >
        <Modal.Header>Checkout with Fin Pay</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Please enter your phone number to checkout:</Header>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 'fit-content',
              }}
            >
              {/* <Label pointing='below'>Phone number</Label> */}
              <Input
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='0712345678...'
              />
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setComplete(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </StyledCheckout>
  );
}
