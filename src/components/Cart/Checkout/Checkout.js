import { useState, useEffect } from 'react';
import {
  Button,
  Header,
  Segment,
  Modal,
  Input,
} from 'semantic-ui-react';
import styled from 'styled-components';
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
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [transactionComplete, setComplete] = useState(false);
  const complete_cart_id =
    new URLSearchParams(location.search).get('fulfill') || '';

  useEffect(() => {
    if (complete_cart_id !== '') {
      console.log('Bob is your uncle');
      setComplete(true);
      resetCart();
    }
  }, [complete_cart_id, resetCart]);

  const checkoutWithFinPay = () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      amt: totalCost, // order amount
      on: cart_id, // unique order number
      pn: phoneNumber, // user phone number
      tenant: '7b29e947-ef2e-4d34-8953-c66ef3da9970', // tenant id for integrator
      referer: `https://fin-shop-stagging.netlify.app/cart?fulfill=${cart_id}`,
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
      {/*doneee*/}
        <Button
          color='grey'
          onClick={() => {
            window.location.href = `https://qa-client.fin-connect.net/apply?product=35&merchant=a267e0d0-b1ea-49e1-b307-d87ecb6109eb&amount=${totalCost}&term=6`;
          }}
        >
          <div style={{paddingBottom:'10px', textAlign:'left'}}>Click here to checkout with Fin</div>
          <div style={{paddingBottom:'10px', textAlign:'left'}}>Only R {
          Number((Number(totalCost)*1.03)/4).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })} X 4 installments <br/> at 7.5 % annual interest</div>
        </Button>
        <Button
          color='green'
          onClick={() => {
            setOpenPaymentDetails(true);
          }}
        >
          Checkout with Fin using a pre-approved credit limit
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
