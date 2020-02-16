import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { api } from '../../services/api';

import Container from '../../components/Container';
import Pagination from '../../components/Pagination';
import { Loading, Owner, IssueList } from './styles';
import { Ring } from 'react-awesome-spinners';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    totalIssues: 0,
    repoName: '',
    currentPage: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const [owner, name] = repoName.split('/');

    const [repository, issues, totalCount] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          page: 1,
          order: 'desc',
          per_page: 8,
        },
      }),
      api
        .post('/graphql', {
          query: `query {
                    repository(owner:"${owner}", name:"${name}") {
                      issues(states:OPEN) {
                        totalCount
                      }
                    }
                  }`,
        })
        .then(result => {
          return result.data.data.repository.issues.totalCount;
        }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      totalIssues: totalCount,
      repoName,
    });
  }

  onPageChanged = async data => {
    const { currentPage } = data;

    this.setState({
      loading: true,
      currentPage: currentPage,
    });

    await api
      .get(`/repos/${this.state.repoName}/issues`, {
        params: {
          state: 'open',
          page: currentPage,
          order: 'desc',
          per_page: 8,
        },
      })
      .then(response => {
        this.setState({
          issues: response.data,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  };

  render() {
    const { repository, issues, loading, totalIssues } = this.state;

    if (loading) {
      return (
        <Loading>
          <Ring />
        </Loading>
      );
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination
          loading={this.state.loading}
          totalRecords={totalIssues}
          pageLimit={8}
          currentPage={this.state.currentPage}
          pageNeighbours={3}
          onPageChanged={this.onPageChanged}
        />
      </Container>
    );
  }
}
