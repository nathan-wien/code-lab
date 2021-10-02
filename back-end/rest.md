# RESTful APIs

from [https://restfulapi.net/](https://restfulapi.net/).

- REST = **RE**presentation **S**tate **T**ransfer

## Principles

1. **Client-server**: separates UI and data
2. **Stateless**: each request from the client to server must contain all of the info necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client.
3. **Cacheable**: to obtain a uniform interace, REST is defined by 4 interface constraints:
  * identification of resources
  * manipulation of resources through representation
  * self-descriptive messages
  * hypermedia as the engine of application state
4. **Layered system**: constraining component behavior such that each component cannot "see" beyond the immediate later with which they are interacting.
5. **Code on demand (optional)**

## Resource

* **Resource** is the key abstraction of information in REST.
  * Any information that can be named can be a resource: a document, an image, a person, a collection of other resources, etc.
* REST uses a **resource identifier** to identify the particular resource involed in an interaction between components.
* **Resource representation**: the state of the resource at any particular timestamp
  * A representation consists of data, metadata describing the data, and **hypermedia** links which can help the clients in transition to the next desired state.
* **Media type**: the data format of a representation.

## Resource Methods

* The REST specification does not specify any resource methods to be used (such as HTTP methods GET/PUT/POST/DELETE).

## HTTP methods vs CRUD Operations

| HTTP method | CRUD operation |
|-------------|----------------|
| POST        | Create         |
| GET         | Read           |
| PUT, PATCH  | Update         |
| DELETE      | Delete         |

## Reformating

* JSend is one option
