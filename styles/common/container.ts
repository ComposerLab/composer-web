import styled from 'styled-components';

export interface Props {
    direction?: string;
    justifyContent?: string;
    alignItems?: string;
    width?: string;
    height?: string;
    marginBottom?: string;
    marginTop?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingRight?: string;
    paddingLeft?: string;
    overflow?: string;
}

export const div = styled.div<Props>`
    display: flex;
    flex-direction: ${(props) => props.direction && props.direction};
    justify-content: ${(props) => props.justifyContent && props.justifyContent};
    align-items: ${(props) => props.alignItems && props.alignItems};
    width: ${(props) => props.width && props.width};
    height: ${(props) => props.height && props.height};
    margin-top: ${(props) => props.marginTop && props.marginTop};
    margin-bottom: ${(props) => props.marginBottom && props.marginBottom};
    padding-top: ${(props) => props.paddingTop && props.paddingTop};
    padding-bottom: ${(props) => props.paddingBottom && props.paddingBottom};
    padding-right: ${(props) => props.paddingRight && props.paddingRight};
    padding-left: ${(props) => props.paddingLeft && props.paddingLeft};
    overflow: ${(props) => props.overflow && props.overflow};
`;
