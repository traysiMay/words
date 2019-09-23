import styled from "styled-components"

const Colors = {
  mood: "#e159e1",
  object: "#53e553",
  sensibility: "#ffff82"
};

const Raptor = styled.div`
text-align: center;
font-size:3rem;
`

const Container = styled.div`
  background: ${props => props.color};
  height: 100%;
  color:white;
`;

const CatContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  text-align: center;
  padding: 0 3rem;
`;

const IContainer = styled.div`
text-align: center;
input {
    height: 30px;
    width: 240px;
    border-radius: 20px;
    text-align: center;
    font-size: 1rem;
}
`
const BContainer = styled.div`
text-align:center;
button {
    width: 130px;
    height: 30px;
    border-radius: 0px 0px 30px 30px;
    font-weight: bolder;
    font-size: 1.1rem;
    color:black;
}
`
const LogContainer = styled.div`
    margin: 2rem 3rem;
    font-family: monospace;
`
const CatButton = styled.div`
  padding: 1rem;
`;
const MoodS = styled(CatButton)`
  background: ${Colors.mood};
`;

const ObjectS = styled(CatButton)`
  background: ${Colors.object};
`;
const SenseS = styled(CatButton)`
  background: ${Colors.sensibility};
`;

export {Raptor, Container, CatContainer, CatButton, IContainer, BContainer, LogContainer, MoodS, ObjectS, SenseS}