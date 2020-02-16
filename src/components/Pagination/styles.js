import styled from 'styled-components';

export const ListPagination = styled.div`
  display: flex !important;
  margin: 20px auto;
  font-size: 12px;
  color: #7159c1;
  ul {
    list-style: none;
    padding-left: 0;
    display: flex;
    border-radius: 0.25rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

    li:hover {
      background: #9793c1;
      transition: background-color 1s;
    }

    li {
      border: 1px solid #ddd;
      cursor: pointer;
      text-decoration: none;
      margin-left: -1px;

      a {
        text-decoration: none;
        padding: 0.75rem 1rem;
        min-width: 3.5rem;
        text-align: center;
        box-shadow: none !important;
        font-weight: 900;
        position: relative;
        display: block;
        line-height: 1.25;
      }
    }

    li.active {
      background-color: #9793c1;
      color: #fff;
    }

    li:last-child {
      border-top-right-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
    }

    li:first-child {
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }
  }
`;
