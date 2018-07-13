// @flow

import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import transactionsEmptyState from '../../../resources/transactionsEmptyState.svg'
import LoaderSpinner from '../LoaderSpinner/';
import { H4 } from '../Heading/';

import * as statuses from '../../constants/StatusTypes';
import { MNEMONIC } from '../../constants/StoreTypes';
import { formatAmount } from '../../utils/currancy';
import Info from './Info';

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  align-self: center;
  width: 400px;
  padding-top: ${ms(5)};
  text-align: center;
`;

const Image = styled.img`(
  display: inline-block;
  padding-bottom: ${ms(4)};
)`;

const Icon = styled.div`
  height:180px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(H4)`
  font-weight: normal;
  font-size: 1.2rem;
  padding-bottom: .2rem
`;

const Description = styled.div`
  font-weight: 300;
  color: #4a4a4a;
  font-size: ${ms(-0.5)}
`;

type Props = {
  isManager?: boolean,
  address?: object
};

function AccountStatus(props: Props) {
  const { isManager, address, theme } = props;

  const storeTypes = address.get('storeTypes');
  const status = address.get('status');
  const operations = address.get('operations').toJS();

  let icon = (
    <LoaderSpinner
      size="x4"
      styles={{
          color:  theme.colors.accent
        }}
    />
  );
  let title = '';
  let description = '';
  let info = null;
  const typeText = isManager
    ? 'account'
    : 'address';
  switch( status ) {
    case statuses.CREATED:
      if ( storeTypes === MNEMONIC ) {
        icon = <Image alt={'Creating account'} src={transactionsEmptyState} />;
        title = 'Your account is ready to receive transactions!';
        description = 'Your first transaction will commit your new address to the blockchain. This process may take some time until you are all set to send and delegate.';
      } else {
        title = `Retrieving your ${ typeText }...`;
        if ( operations[ statuses.CREATED ] ) {
          const operationName = isManager
            ? 'activation operation id'
            : 'origination operation id';
          info = (
            <Info
              firstIconName="icon-star"
              operationName={ operationName }
              operationId={ operations[ statuses.CREATED ] }
              lastIconName="icon-new-window"
            />
          );
        }
      }
      break;
    case statuses.FOUND:
    case statuses.PENDING:
      title = `Preparing your ${ typeText }...`;
      if ( operations[ statuses.FOUND ] ) {
        info = (
          <Info
            firstIconName="icon-broadcast"
            operationName="public key reveal operation id"
            operationId={ operations[ statuses.FOUND ] }
            lastIconName="icon-new-window"
          />
        );
      }

      if ( storeTypes === MNEMONIC ) {
        const transaction = address.get('transactions').toJS();
        const { amount } = transaction[0];
        description = `We have received your first transaction of ${ formatAmount(amount, 2) } tez! Preparing your account now, this might take a while.`;
      }
      break;
  }

  return (
    <Container>
      <Icon>{ icon }</Icon>
      <Title>{ title }</Title>
      {
        description
          ? <Description>{ description }</Description>
          : null
      }
      { info }
    </Container>
  );
}

export default withTheme(AccountStatus);
