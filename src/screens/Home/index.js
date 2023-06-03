import React, { useState, useEffect, useRef } from "react";
import { Text, Dimensions, View } from "react-native";
import {Audio} from 'expo-av'
import { Container, Header, TitleHeader, 
    DescriptionHeader, Circle, SubContainerCircle, TitleTime, 
    SubContainerButtons, ButtonInteractive, TitleButton, SubContainer } from "./styles";

function Home() {

    const { width, height } = Dimensions.get('window')

    const circleSizeConst = Math.min( width, height ) * 0.8

    const [cronAtivo, setCronAtivo] = useState(false)
    const [valorSegundos, setValorSegundos] = useState(0)
    const [valorMinutos, setValorMinutos] = useState(0)

    const [intervaloAlterado, setIntervaloAlterado] = useState(0)

    const soundRef = useRef(null)

    useEffect(() => {
      //carrega som do relogio
      const loadSound = async () => {
        const { sound: soundObject } = await Audio.Sound.createAsync(
          require('../../utils/clock_sound.mp3')
        );
        soundRef.current = soundObject
      };


      loadSound()

      return () => {
          //Remove o som, ao sair da tela
          if(soundRef.current){
            soundRef.current.unloadAsync()
          }
      }

    } , [] )


    function pararCronometro(){

      if(intervaloAlterado){
        clearInterval(intervaloAlterado)
      }

      setCronAtivo(false)

    }

    function zerarCampos(){
      pararCronometro()
      setValorMinutos(0)
      setValorSegundos(0)
    }


    function iniciarCronometro(){
      setIntervaloAlterado(

        setInterval(() => {
          alterarTempo()
        }, 1000)

      )


      setCronAtivo(true)
    }

    function alterarTempo(){
      if(soundRef.current){
        soundRef.current.replayAsync()
      }

      setValorSegundos((valorAnterior) => {

        if(valorAnterior +1 == 60){
          setValorMinutos(minutos => minutos +1)
          return 0
        }

        return valorAnterior + 1
      })

    }

  return (
    <Container>

    <SubContainer>
      
<View/>

      <Header>
    <TitleHeader>CronApp</TitleHeader>
    <DescriptionHeader>App feito por William</DescriptionHeader>
      </Header>


      <Circle circleSize={circleSizeConst} >

        <SubContainerCircle>
            <TitleTime>{ valorMinutos < 10 ?  "0" + valorMinutos : valorMinutos  }</TitleTime>
            <TitleTime>{':'}</TitleTime>
            <TitleTime>{ valorSegundos < 10 ? "0" + valorSegundos : valorSegundos }</TitleTime>

        </SubContainerCircle>

      </Circle>


      <SubContainerButtons>


        {
!cronAtivo //transforma em TRUE

?
<ButtonInteractive onPress={() =>  iniciarCronometro()  }  >  
<TitleButton>Start</TitleButton>
</ButtonInteractive>

:

<ButtonInteractive  onPress={() => pararCronometro() }  >  
<TitleButton>Pause</TitleButton>
</ButtonInteractive>

        }

 

<View style={{ width:22 }} />
        
        <ButtonInteractive  disabled={valorSegundos == 0 && valorMinutos == 0 }   onPress={() => zerarCampos() }  >  
            <TitleButton>Stop</TitleButton>
        </ButtonInteractive>

      </SubContainerButtons>

      </SubContainer>

    </Container>
  );
}

export {Home};
