import { Button, Header, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

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
export default function Checkout({ totalCost, getTotalItems }) {
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

      <Button
        color="green"
        onClick={() => {
          window.location.href =
            `https://qa-client.fin-connect.net/apply?product=35&merchant=a267e0d0-b1ea-49e1-b307-d87ecb6109eb&amount=${totalCost}&term=6`;
        }}
      >
        Checkout with Fin
      </Button>
    </StyledCheckout>
  );
}
