import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

// TODO: throw in config
const baseUrl = 'https://my-blogster-app-123.s3.us-east-2.amazonaws.com/'

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  // TODO: move styling to separate file
  renderImage() {
    if (this.props.blog.imageUrl) {
      return (
        <img
          style={{
            marginleft: 161,
            marginRight: 161,
            width: '100%',
            height: 'auto'
          }}
          src={`${baseUrl}${this.props.blog.imageUrl}`}
        />
      );
    }
  }

  render() {
    if (!this.props.blog) {
      return '';
    }

    const { title, content } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        {this.renderImage()}
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
