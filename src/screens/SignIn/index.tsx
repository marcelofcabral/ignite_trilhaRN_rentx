import React, { useState } from "react";
import {
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import * as Yup from "yup";
import { useTheme } from "styled-components";

import { useAuth } from "../../hooks/auth";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { PasswordInput } from "../../components/PasswordInput";

import { Container, Header, Title, SubTitle, Footer, Form } from "./styles";

export function SignIn() {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required("E-mail obrigatório")
        .email("Digite um e-mail válido"),
      password: Yup.string().required("A senha é obrigatória"),
    });
    try {
      await schema.validate({ email, password });
      signIn({ email, password });
    } catch (e) {
      console.log("catch handleSignIn SignIn");
      if (e instanceof Yup.ValidationError) Alert.alert("Opa", e.message);
      else
        Alert.alert(
          "Erro na autenticação",
          "Ocorreu um erro ao fazer login, verifique suas credenciais."
        );
    }
  }

  function handleCreateNewAccount() {
    navigation.navigate({
      name: "SignUpFirstStep" as never,
      params: null as never,
    });
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>
              Estamos{"\n"}
              quase lá.
            </Title>
            <SubTitle>
              Faça seu login para começar{"\n"}
              uma experiência incrível.
            </SubTitle>
          </Header>
          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
          </Form>
          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
            />
            <Button
              title="Criar conta gratuita"
              color={theme.colors.background_secondary}
              light
              onPress={handleCreateNewAccount}
              enabled={true}
              loading={false}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
