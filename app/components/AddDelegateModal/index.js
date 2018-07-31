// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Tooltip from '../Tooltip/';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import TezosNumericInput from '../TezosNumericInput'
import { wrapComponent } from '../../utils/i18n';

import Button from '../Button/';
import Loader from '../Loader/';
import Fees from '../Fees/';
import PasswordInput from '../PasswordInput';
import TezosAmount from '../TezosAmount/';

import {
  createNewAccount,
  fetchOriginationAverageFees
} from '../../reduxContent/createDelegate/thunks';

type Props = {
  selectedParentHash: string,
  createNewAccount: Function,
  fetchOriginationAverageFees: Function,
  open: boolean,
  onCloseClick: Function,
  t: Function,
  managerBalance: number
};

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const DelegateContainer = styled.div`
  width: 100%;
  position: relative;
`;

const TextfieldTooltip = styled(Button)`
  position: absolute;
  right: 10px;
  top: 44px;
`;

const TooltipContainer = styled.div`
  padding: 10px;
  color: #000;
  font-size: 14px;
  max-width: 312px;
  
  .customArrow .rc-tooltip-arrow {
    left: 66%;
  }
`;

const TooltipTitle = styled.div`
  color: #123262;
  font-weight: bold;
  font-size: 16px;
`;

const TooltipContent1 = styled.div`
  border-bottom:solid 1px #94a9d1;
  padding: 12px 0;
`;

const TooltipContent2 = styled.div`
  padding: 12px 0;
`;

const AmountFeePassContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  justify-content: center;
`;

const AmountSendContainer = styled.div`
  width: 100%;
  position: relative;
  height: 64px;
`;

const FeeContainer = styled.div`
  width: 100%;
  display: flex;
  height: 64px;
`;

const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 42px;
`;

const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
`;
const MainContainer = styled.div`
  display: flex;
`

const BalanceContainer = styled.div`
  padding: 0 0px 0 20px;
  flex: 1;
  position: relative;
  margin: 15px 0 0px 40px;

`
const BalanceArrow = styled.div`
  top: 50%;
  left: 4px;
  margin-top: -17px;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  border-right: 20px solid ${({ theme: { colors } }) => colors.gray1};;
  width: 0;
  height: 0;
  position: absolute;
`
const BalanceContent = styled.div`
  padding: ${ms(1)} ${ms(1)} ${ms(1)} ${ms(4)};
  color: #123262;
  text-align: left;
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`
const GasInputContainer = styled.div`
  width: 100%;
  position: relative;
  height: 64px;
`

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  left: 70px;
  top: 43px;
  display: block;
`;

const UseMax = styled.div`
  position: absolute;
  right: 23px;
  top: 38px;
  font-size: 12px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;
const TotalAmount = styled(TezosAmount)`
  margin-bottom: 22px;
`;
const BalanceAmount = styled(TezosAmount)`
`;

const WarningIcon = styled(TezosIcon)`
  padding: 0 ${ms(-9)} 0 0;
`;
const BalanceTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.gray5};
  font-size: 14px;
`;
const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.error1};
`

const utez = 1000000;

const defaultState = {
  isLoading: false,
  delegate: '',
  amount: '0',
  fee: 100,
  passPhrase: '',
  isShowedPwd: false, 
  averageFees: {
    low: 100,
    medium: 200,
    high: 400
  },
  gas: 257000
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps) {
    const { open, fetchOriginationAverageFees, managerBalance } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchOriginationAverageFees();
      const fee = averageFees.low;
      const total = fee + this.state.gas;
      this.setState({ averageFees, fee, total, balance: managerBalance});// eslint-disable-line react/no-did-update-set-state
    }
  }

  onUseMax = () => {
    const { managerBalance } = this.props;
    const { fee, gas } = this.state;
    const max = managerBalance - fee - gas - 1;
    const amount = (max/utez).toFixed(6);
    const total = managerBalance - 1;
    const balance = 1;
    this.setState({ amount, total, balance });
  }

  changeAmount = (amount) => {
    const { managerBalance } = this.props;
    const { fee, gas } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + gas;
    const balance = managerBalance - total;
    this.setState({ amount, total, balance });
  }
  
  changeDelegate = (_, delegate) => this.setState({ delegate });
  changeFee = (fee) => {
    const { managerBalance } = this.props;
    const { gas, amount } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + gas;
    const balance = managerBalance - total;
    this.setState({ fee, total, balance });
  }
  updatePassPhrase = (passPhrase) => this.setState({ passPhrase });
  setIsLoading = (isLoading) =>  this.setState({ isLoading });

  renderToolTipComponent = () => {
    return (
      <TooltipContainer>
        <TooltipTitle>Setting a Delegate</TooltipTitle>
        <TooltipContent1>
          You can always change the delegate at a later time.
        </TooltipContent1>
        <TooltipContent1>
          There is a fee for changing the delegate.
        </TooltipContent1>
        <TooltipContent2>
          {
            'You can only delegate to the Manager Address. The Manager Address always starts with "tz1".'
          }
        </TooltipContent2>
      </TooltipContainer>
    );
  };

  renderGasToolTip = (gas) => {
    return (
      <TooltipContainer>
        {gas} tz is required by the network to create a delegate address
      </TooltipContainer>
    );
  };

  createAccount = async () => {
    const { createNewAccount, selectedParentHash, onCloseClick } = this.props;
    const { delegate, amount, fee, passPhrase } = this.state;
    this.setIsLoading(true);
    if (
      await createNewAccount(
        delegate,
        amount,
        Math.floor(fee),
        passPhrase,
        selectedParentHash
      )
    ) {
      this.setState(defaultState);
      onCloseClick();
    } else {
      this.setIsLoading(false);
    }
  };

  render() {
    const { open, onCloseClick, t } = this.props;
    const { isLoading, averageFees, delegate, amount, fee, passPhrase, isShowedPwd, gas, total ,balance } = this.state;
    const isDisabled = isLoading || !delegate || !amount || !passPhrase || balance<1;
    return (
      <Dialog
        modal
        open={open}
        title="Add a Delegate"
        bodyStyle={{ padding: '5px 80px 50px 80px' }}
        titleStyle={{ padding: '50px 70px 0px' }}
      >
        <CloseIcon
          style={{
            fill: '#7190C6',
            cursor: 'pointer',
            height: '20px',
            width: '20px',
            position: 'absolute',
            top: '10px',
            right: '15px',
          }}
          onClick={onCloseClick}
        />
        <DelegateContainer>
          <TextField
            floatingLabelText="Delegate Address"
            style={{ width: '100%' }}
            onChange={this.changeDelegate}
          />
          <Tooltip
            position="bottom"
            content={this.renderToolTipComponent()}
            align={{
              offset: [70, 0]
            }}
            arrowPos={{
              left: '70%'
            }}
          >
            <TextfieldTooltip
              buttonTheme="plain"
            >
              <HelpIcon
                iconName="help"
                size={ms(0)}
                color='secondary'
              />
            </TextfieldTooltip>
          </Tooltip>
        </DelegateContainer>
        <MainContainer>
          <AmountFeePassContainer>
            <AmountSendContainer>
              <TezosNumericInput decimalSeparator={t('general.decimal_separator')} labelText={t('general.amount')} amount={this.state.amount}  handleAmountChange={this.changeAmount} />
              <UseMax onClick={this.onUseMax}>Use Max</UseMax>
            </AmountSendContainer>
            <FeeContainer>
              <Fees
                styles={{ width: '100%' }}
                low={averageFees.low}
                medium={averageFees.medium}
                high={averageFees.high}
                fee={fee}
                onChange={this.changeFee}
              />
            </FeeContainer>
            <GasInputContainer>
              <TextField
                disabled
                floatingLabelText="Gas"
                defaultValue="0.257000"
                style={{ width: '100%', cursor: 'default' }}
              />
              <TezosIconInput color="gray5" iconName="tezos" />
              <Tooltip
                position="bottom"
                content={this.renderGasToolTip(gas/utez)}
                align={{
                  offset: [70, 0]
                }}
                arrowPos={{
                  left: '71%'
                }}
              >
                <TextfieldTooltip
                  buttonTheme="plain"
                >
                  <HelpIcon
                    iconName="help"
                    size={ms(0)}
                    color='secondary'
                  />
                </TextfieldTooltip>
              </Tooltip>
            </GasInputContainer>
          </AmountFeePassContainer>
          <BalanceContainer>
            <BalanceArrow />
            <BalanceContent>
              <BalanceTitle>Total</BalanceTitle>
              <TotalAmount
                weight='500'
                color="gray3"
                size={ms(1)}
                amount={total}
              />              
              <BalanceTitle>Remaining Balance</BalanceTitle>
              <BalanceAmount
                weight='500'
                color={balance<1?'error1':'gray3'}
                size={ms(-1)}
                amount={balance}
              />
              {balance < 1 &&
                <ErrorContainer>
                  <WarningIcon
                    iconName="warning"
                    size={ms(-1)}
                    color='error1'
                  />
                  Total exceeds available funds.
                </ErrorContainer>
              }
              
            </BalanceContent>
          </BalanceContainer>
        </MainContainer>

        <PasswordButtonContainer>
          <PasswordInput
            label='Wallet Password'
            isShowed={isShowedPwd}
            changFunc={this.updatePassPhrase}
            containerStyle={{width: '60%'}}
            onShow={()=> this.setState({isShowedPwd: !isShowedPwd})}   
          />
          <DelegateButton
            buttonTheme="primary"
            disabled={isDisabled}
            onClick={this.createAccount}
          >
            Delegate
          </DelegateButton>
        </PasswordButtonContainer>
        {isLoading && <Loader />}
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchOriginationAverageFees,
      createNewAccount
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(null, mapDispatchToProps))(AddDelegateModal);
